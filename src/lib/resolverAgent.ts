import { GeneratedSchema, ExtractedRecord, WorkflowSummary } from '@/types';

export function normalizeAndDeduplicate(
  records: ExtractedRecord[],
  schema: GeneratedSchema,
  durationMs: number = 2400
): { cleanedRecords: ExtractedRecord[]; summary: WorkflowSummary } {
  const primaryKeys = schema.primaryKeys.length > 0 ? schema.primaryKeys : [schema.attributes[0]?.name || 'name'];
  const seenKeyHashes = new Map<string, string>();
  let dedupCount = 0;
  const sourcesSet = new Set<string>();
  let totalConfidence = 0;
  let totalFieldsCount = 0;
  let validFieldsCount = 0;

  const cleanedRecords: ExtractedRecord[] = records.map((record) => {
    const cleanedData: Record<string, any> = { ...record.data };

    // 1. Attribute Normalization
    for (const attr of schema.attributes) {
      totalFieldsCount++;
      const val = cleanedData[attr.name];

      if (val !== undefined && val !== null && String(val).trim() !== '') {
        validFieldsCount++;

        if (attr.type === 'string') {
          cleanedData[attr.name] = String(val).trim().replace(/\s+/g, ' ');
        } else if (attr.type === 'number') {
          const num = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
          cleanedData[attr.name] = isNaN(num) ? val : num;
        } else if (attr.type === 'url') {
          let urlStr = String(val).trim();
          if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
            urlStr = `https://${urlStr}`;
          }
          cleanedData[attr.name] = urlStr;
        }
      }

      // Track confidence
      const prov = record.provenance?.[attr.name];
      if (prov) {
        totalConfidence += prov.confidence;
        if (prov.sourceUrl) {
          sourcesSet.add(prov.sourceUrl);
        }
      }
    }

    // 2. Primary Key Hash Deduplication
    const keyParts = primaryKeys.map(k => String(cleanedData[k] || '').toLowerCase().trim());
    const hash = keyParts.join('::');

    let isDuplicate = record.isDuplicate;
    let duplicateOf = record.duplicateOf;

    if (hash && hash !== '::' && hash !== '') {
      if (seenKeyHashes.has(hash)) {
        isDuplicate = true;
        duplicateOf = seenKeyHashes.get(hash);
        dedupCount++;
      } else {
        seenKeyHashes.set(hash, record.id);
      }
    }

    // 3. Validation Scoring
    let requiredCount = 0;
    let requiredMet = 0;
    for (const attr of schema.attributes) {
      if (attr.required) {
        requiredCount++;
        const v = cleanedData[attr.name];
        if (v !== undefined && v !== null && String(v).trim() !== '' && String(v) !== 'N/A') {
          requiredMet++;
        }
      }
    }

    const validationScore = requiredCount > 0 
      ? Math.round((requiredMet / requiredCount) * 100) 
      : 100;

    return {
      ...record,
      data: cleanedData,
      isDuplicate,
      duplicateOf,
      validationScore
    };
  });

  const validRate = totalFieldsCount > 0 
    ? Math.round((validFieldsCount / totalFieldsCount) * 100) 
    : 100;

  const avgConfidence = totalFieldsCount > 0 
    ? Math.round((totalConfidence / totalFieldsCount) * 100) 
    : 95;

  const summary: WorkflowSummary = {
    totalExtracted: cleanedRecords.length,
    validRate,
    sourcesCount: Math.max(sourcesSet.size, schema.searchStrategy.targetDomainHints.length),
    avgConfidence,
    durationMs,
    dedupCount
  };

  return { cleanedRecords, summary };
}
