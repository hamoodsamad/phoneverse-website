import { Smartphone, ComparisonResult, RecommendationRequest, RecommendationResponse, RecommendedPhone } from '@/types';

export interface AiComparisonOptions {
  apiKey?: string;
  model?: string;
}

export class AiService {
  private apiKey: string | undefined;
  private model: string;

  constructor(options?: AiComparisonOptions) {
    this.apiKey = options?.apiKey || process.env.OPENAI_API_KEY;
    this.model = options?.model || process.env.OPENAI_MODEL || 'gpt-4o';
  }

  /**
   * Compares 2 or more smartphones using OpenAI GPT-4o if available,
   * or a deterministic verified technical rule engine if not.
   */
  async compareSmartphones(phones: Smartphone[]): Promise<ComparisonResult> {
    if (phones.length < 2) {
      throw new Error('At least 2 smartphones are required for comparison.');
    }

    if (this.apiKey) {
      try {
        return await this.callOpenAiComparison(phones);
      } catch (err) {
        console.warn('OpenAI API call failed, falling back to deterministic technical comparison:', err);
        return this.generateDeterministicComparison(phones);
      }
    }

    // Default fallback when OpenAI key is not set
    return this.generateDeterministicComparison(phones);
  }

  /**
   * Generates tailored smartphone recommendations based on budget, priorities, and verified specs.
   */
  async generateRecommendations(
    request: RecommendationRequest,
    catalog: Smartphone[]
  ): Promise<RecommendationResponse> {
    if (this.apiKey) {
      try {
        return await this.callOpenAiRecommendation(request, catalog);
      } catch (err) {
        console.warn('OpenAI API recommendation call failed, using rule engine:', err);
        return this.generateDeterministicRecommendation(request, catalog);
      }
    }

    return this.generateDeterministicRecommendation(request, catalog);
  }

  /**
   * OpenAI GPT-4o Implementation
   */
  private async callOpenAiComparison(phones: Smartphone[]): Promise<ComparisonResult> {
    const verifiedSpecsSummary = phones.map(p => ({
      name: p.name,
      brand: p.brand_name,
      base_price_pkr: p.base_price_pkr,
      pta_status: p.pta_status,
      chipset: p.specs?.chipset,
      display: `${p.specs?.display_size_inches}" ${p.specs?.display_type} ${p.specs?.refresh_rate_hz}Hz`,
      rear_camera: p.specs?.rear_camera_setup,
      front_camera: p.specs?.front_camera_setup,
      battery: `${p.specs?.battery_capacity_mah}mAh (${p.specs?.wired_charging_watts}W charging)`,
      ip_rating: p.specs?.ip_rating,
      software_policy: p.specs?.os_update_policy,
      build: p.specs?.frame_material
    }));

    const prompt = `
You are an expert mobile technology architect analyzing smartphones for the Pakistani market (prices in PKR).
Compare these phones based strictly on verified technical specifications:
${JSON.stringify(verifiedSpecsSummary, null, 2)}

Return ONLY valid JSON matching this exact structure:
{
  "summary": "2-3 sentence executive verdict",
  "cameraComparison": "Specific camera optics & sensor breakdown",
  "gamingComparison": "GPU, thermal and raw silicon throughput comparison",
  "batteryComparison": "Endurance, charging wattage and battery chemistry comparison",
  "valueForMoneyVerdict": "Value assessment in Pakistan PKR context",
  "bestForGamingName": "${phones[0].name}",
  "bestForPhotographyName": "${phones[0].name}",
  "bestForBatteryName": "${phones[0].name}",
  "bestValueName": "${phones[0].name}",
  "overallWinnerName": "${phones[0].name}",
  "prosAndCons": {
    "${phones[0].name}": { "pros": ["pro1", "pro2"], "cons": ["con1"] }
  }
}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    const findIdByName = (name: string) => {
      const found = phones.find(p => p.name.toLowerCase().includes(name.toLowerCase()));
      return found ? found.id : phones[0].id;
    };

    const prosAndConsMap: Record<string, { pros: string[]; cons: string[] }> = {};
    phones.forEach(p => {
      const entry = content.prosAndCons?.[p.name] || { pros: ['Verified official specifications', 'Excellent build quality'], cons: ['High tier investment'] };
      prosAndConsMap[p.id] = entry;
    });

    return {
      phones,
      categoryWinners: [
        { category: 'Camera & Optics', winnerPhoneId: findIdByName(content.bestForPhotographyName), reason: content.cameraComparison.slice(0, 140) },
        { category: 'Gaming & Performance', winnerPhoneId: findIdByName(content.bestForGamingName), reason: content.gamingComparison.slice(0, 140) },
        { category: 'Battery & Charging', winnerPhoneId: findIdByName(content.bestForBatteryName), reason: content.batteryComparison.slice(0, 140) },
        { category: 'Value for Money (PKR)', winnerPhoneId: findIdByName(content.bestValueName), reason: content.valueForMoneyVerdict.slice(0, 140) }
      ],
      overallWinnerId: findIdByName(content.overallWinnerName),
      aiAnalysis: {
        summary: content.summary,
        cameraComparison: content.cameraComparison,
        gamingComparison: content.gamingComparison,
        batteryComparison: content.batteryComparison,
        valueForMoneyVerdict: content.valueForMoneyVerdict,
        bestForGamingId: findIdByName(content.bestForGamingName),
        bestForPhotographyId: findIdByName(content.bestForPhotographyName),
        bestForBatteryId: findIdByName(content.bestForBatteryName),
        bestValueId: findIdByName(content.bestValueName)
      },
      prosAndCons: prosAndConsMap,
      isAiGenerated: true
    };
  }

  /**
   * Deterministic Technical Comparison Fallback
   */
  private generateDeterministicComparison(phones: Smartphone[]): ComparisonResult {
    // Determine photography winner by camera sensor size / megapixel & lens count
    let bestPhoto = phones[0];
    let bestGaming = phones[0];
    let bestBattery = phones[0];
    let bestValue = phones[0];

    let minPriceRatio = 99999999;

    phones.forEach(p => {
      const s = p.specs;
      if (!s) return;

      // Battery check
      if ((s.battery_capacity_mah || 0) > (bestBattery.specs?.battery_capacity_mah || 0)) {
        bestBattery = p;
      }

      // Camera check (heuristic based on 200MP or 5x optical telephoto)
      if (s.rear_camera_setup.includes('200MP') || s.rear_camera_setup.includes('Periscope')) {
        bestPhoto = p;
      }

      // Gaming check (Snapdragon 8 Elite or A18 Pro)
      if (s.chipset.includes('Snapdragon 8 Elite') || s.chipset.includes('A18 Pro')) {
        bestGaming = p;
      }

      // Value check (spec-to-PKR ratio)
      const ratio = p.base_price_pkr / ((s.refresh_rate_hz || 60) + (s.battery_capacity_mah || 4000) / 100);
      if (ratio < minPriceRatio) {
        minPriceRatio = ratio;
        bestValue = p;
      }
    });

    const overallWinner = bestGaming;

    const prosAndConsMap: Record<string, { pros: string[]; cons: string[] }> = {};
    phones.forEach(p => {
      const s = p.specs;
      const pros: string[] = [];
      const cons: string[] = [];

      if (s?.refresh_rate_hz && s.refresh_rate_hz >= 120) pros.push(`Ultra-smooth ${s.refresh_rate_hz}Hz display`);
      if (s?.battery_capacity_mah && s.battery_capacity_mah >= 5000) pros.push(`Large ${s.battery_capacity_mah}mAh battery`);
      if (s?.supports_5g) pros.push('Future-proof 5G connectivity');
      if (p.pta_status === 'PTA Approved') pros.push('Official PTA Approved with local warranty');

      if (p.base_price_pkr > 300000) cons.push('Premium flagship price segment');
      if (!s?.headphone_jack_3_5mm) cons.push('No 3.5mm headphone jack');
      if (s?.wired_charging_watts && s.wired_charging_watts <= 30) cons.push('Moderate 30W charging speed');

      prosAndConsMap[p.id] = { pros, cons };
    });

    return {
      phones,
      categoryWinners: [
        { category: 'Camera & Optics', winnerPhoneId: bestPhoto.id, reason: `${bestPhoto.name} features superior optical hardware: ${bestPhoto.specs?.rear_camera_setup}.` },
        { category: 'Gaming & Performance', winnerPhoneId: bestGaming.id, reason: `${bestGaming.name} leads with flagship silicon: ${bestGaming.specs?.chipset}.` },
        { category: 'Battery & Endurance', winnerPhoneId: bestBattery.id, reason: `${bestBattery.name} packs a ${bestBattery.specs?.battery_capacity_mah}mAh battery with rapid charging.` },
        { category: 'Value for Money (PKR)', winnerPhoneId: bestValue.id, reason: `${bestValue.name} offers the most balanced feature-to-rupee ratio in Pakistan.` }
      ],
      overallWinnerId: overallWinner.id,
      aiAnalysis: {
        summary: `Comparing ${phones.map(p => p.name).join(' vs ')}. ${overallWinner.name} stands out as the most cohesive flagship, while ${bestValue.name} represents exceptional value in the Pakistani market.`,
        cameraComparison: `${bestPhoto.name} offers the most versatile imaging suite (${bestPhoto.specs?.rear_camera_setup}) with optical stabilization and periscope zoom.`,
        gamingComparison: `${bestGaming.name} equipped with ${bestGaming.specs?.chipset} delivers top frame stability and minimal thermal throttling.`,
        batteryComparison: `${bestBattery.name} leads endurance with ${bestBattery.specs?.battery_capacity_mah}mAh capacity and ${bestBattery.specs?.wired_charging_watts}W charging.`,
        valueForMoneyVerdict: `${bestValue.name} delivers flagship-grade features at ₨ ${bestValue.base_price_pkr.toLocaleString()}, making it highly competitive against higher-priced competitors.`,
        bestForGamingId: bestGaming.id,
        bestForPhotographyId: bestPhoto.id,
        bestForBatteryId: bestBattery.id,
        bestValueId: bestValue.id
      },
      prosAndCons: prosAndConsMap,
      isAiGenerated: false
    };
  }

  private async callOpenAiRecommendation(
    request: RecommendationRequest,
    catalog: Smartphone[]
  ): Promise<RecommendationResponse> {
    // If OpenAI key is present, invoke GPT-4o for nuanced natural language reasoning
    const prompt = `
The user is looking for a smartphone in Pakistan.
User Requirements:
- Maximum Budget: PKR ${request.budget_pkr.toLocaleString()}
- Preferred Brand: ${request.preferred_brand || 'Any'}
- Priorities: ${request.usage_priorities.join(', ')}
- Needs 5G: ${request.needs_5g ? 'Yes' : 'Not required'}

Available Phones in Verified Database:
${JSON.stringify(catalog.map(p => ({
  id: p.id,
  name: p.name,
  brand: p.brand_name,
  price_pkr: p.base_price_pkr,
  chipset: p.specs?.chipset,
  camera: p.specs?.rear_camera_setup,
  battery: p.specs?.battery_capacity_mah,
  refresh_rate: p.specs?.refresh_rate_hz
})), null, 2)}

Recommend up to 3 best matching phones strictly from the catalog within or very close to budget.
Return ONLY valid JSON:
{
  "recommendedPhoneIds": ["p1", "p2"],
  "reasons": { "p1": "reason why", "p2": "reason why" },
  "overallAdvice": "General market advice for Pakistani buyer"
}
`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.3
      })
    });

    if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}`);

    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    const recommended: RecommendedPhone[] = [];
    (parsed.recommendedPhoneIds || []).forEach((id: string, index: number) => {
      const phone = catalog.find(p => p.id === id);
      if (phone) {
        recommended.push({
          phone,
          matchScore: 95 - index * 5,
          recommendationReason: parsed.reasons?.[id] || 'Top match for your specified budget and priorities.',
          keyStrengths: [
            phone.specs?.chipset || '',
            phone.specs?.rear_camera_setup || '',
            `${phone.specs?.battery_capacity_mah}mAh Battery`
          ].filter(Boolean)
        });
      }
    });

    if (recommended.length === 0) {
      return this.generateDeterministicRecommendation(request, catalog);
    }

    return {
      recommendations: recommended,
      aiReasoning: parsed.overallAdvice || 'Recommendations generated based on your exact budget and performance preferences in Pakistan.',
      isAiGenerated: true
    };
  }

  private generateDeterministicRecommendation(
    request: RecommendationRequest,
    catalog: Smartphone[]
  ): Promise<RecommendationResponse> {
    const budget = request.budget_pkr;
    const filtered = catalog.filter(p => {
      // Allow up to 10% tolerance above budget if no exact matches
      const priceOk = p.base_price_pkr <= budget * 1.1;
      const brandOk = !request.preferred_brand || p.brand_name.toLowerCase() === request.preferred_brand.toLowerCase();
      return priceOk && brandOk;
    });

    const candidates = filtered.length > 0 ? filtered : catalog;

    // Score based on priorities
    const scored = candidates.map(p => {
      let score = 50;
      const s = p.specs;

      if (p.base_price_pkr <= budget) score += 20;

      if (request.usage_priorities.includes('gaming')) {
        if (s?.chipset.includes('Snapdragon 8') || s?.chipset.includes('A18') || s?.chipset.includes('Dimensity 9')) score += 25;
        if (s?.refresh_rate_hz && s.refresh_rate_hz >= 120) score += 10;
      }

      if (request.usage_priorities.includes('camera')) {
        if (s?.rear_camera_setup.includes('Periscope') || s?.rear_camera_setup.includes('200MP') || s?.rear_camera_setup.includes('Leica') || s?.rear_camera_setup.includes('ZEISS')) score += 25;
      }

      if (request.usage_priorities.includes('battery')) {
        if (s?.battery_capacity_mah && s.battery_capacity_mah >= 5000) score += 20;
      }

      return {
        phone: p,
        score
      };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 3);

    const recommendations: RecommendedPhone[] = top.map((item, idx) => ({
      phone: item.phone,
      matchScore: Math.min(99, item.score),
      recommendationReason: `Selected as the top choice for your ${request.usage_priorities.join(' & ')} priorities within ${request.budget_pkr ? '₨ ' + request.budget_pkr.toLocaleString() : 'your budget'}.`,
      keyStrengths: [
        item.phone.specs?.chipset ? `Processor: ${item.phone.specs.chipset}` : '',
        item.phone.specs?.rear_camera_setup ? `Camera: ${item.phone.specs.rear_camera_setup}` : '',
        item.phone.specs?.battery_capacity_mah ? `Battery: ${item.phone.specs.battery_capacity_mah}mAh` : ''
      ].filter(Boolean)
    }));

    return Promise.resolve({
      recommendations,
      aiReasoning: 'These recommendations are calculated strictly using verified technical specifications and verified Pakistani market retail prices.',
      isAiGenerated: false
    });
  }
}

export const aiService = new AiService();
