import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AggregatedPart, SupplierName, Packaging, PriceBreak, Specification } from '../models/aggregated-part.model';

@Injectable()
export class AggregatedPartService {
  private myArrowUrl = 'https://backend-takehome.s3.us-east-1.amazonaws.com/myarrow.json';
  private ttiUrl = 'https://backend-takehome.s3.us-east-1.amazonaws.com/tti.json';

  constructor(private readonly httpService: HttpService) { }

  async getAggregatedPart(partNumber: string): Promise<AggregatedPart | null> {
    const [arrowResponse, ttiResponse] = await Promise.all([
      firstValueFrom(this.httpService.get(this.myArrowUrl)),
      firstValueFrom(this.httpService.get(this.ttiUrl)),
    ]);

    const arrowData = arrowResponse.data;
    const ttiData = ttiResponse.data;

    if (!Array.isArray(arrowData.pricingResponse)) {
      return null;
    }

    const arrowPart = arrowData.pricingResponse.find((item: any) => item.partNumber === partNumber);
    const ttiPart = ttiData.parts.find((item: any) => item.manufacturerPartNumber === partNumber);

    if (!arrowPart && !ttiPart) return null;

    const aggregatedPart: AggregatedPart = {
      name: arrowPart?.name || ttiPart?.manufacturer || 'Unknown',
      description: arrowPart?.description || ttiPart?.description || 'No description available',
      totalStock: (arrowPart?.stock || 0) + (ttiPart?.availableToSell || 0),
      manufacturerLeadTime: this.extractManufacturerLeadTime(arrowPart || ttiPart),
      manufacturerName: arrowPart?.manufacturer || ttiPart?.manufacturer || 'Unknown',
      manufacturerPartNumber: arrowPart?.partNumber || ttiPart?.manufacturerPartNumber || 'Unknown',
      packaging: [
        ...this.extractPackaging(arrowPart, SupplierName.ARROW),
        ...this.extractPackaging(ttiPart.data, SupplierName.TTI),
      ],
      productDoc: arrowPart?.datasheet || ttiPart?.datasheet || '',
      productUrl: arrowPart?.productUrl || ttiPart?.datasheetURL || '',
      productImageUrl: arrowPart?.imageUrl || ttiPart?.imageUrl || '',
      specifications: this.extractSpecifications(arrowPart, ttiPart),
      sourceParts: [
        ...(arrowPart ? [SupplierName.ARROW] : []),
        ...(ttiPart ? [SupplierName.TTI] : []),
      ],
    };


    return aggregatedPart;
  }


  private extractPackaging(part: any, supplier: SupplierName): Packaging[] {
    if (!part || !Array.isArray(part.packaging)) return [];

    return part.packaging.map((pkg: any) => ({
      type: pkg.type,
      minimumOrderQuantity: pkg.moq,
      quantityAvailable: pkg.stock,
      unitPrice: pkg.unitPrice,
      supplier,
      priceBreaks: pkg.priceBreaks ? pkg.priceBreaks.map((pb: any) => ({
        breakQuantity: pb.breakQuantity,
        unitPrice: pb.unitPrice,
        totalPrice: pb.breakQuantity * pb.unitPrice,
      })) : [],
    }));

  }


  private extractSpecifications(arrowPart: any, ttiPart: any): Specification[] {
    const specs = new Map<string, string>();
    [...(arrowPart?.specifications || []), ...(ttiPart?.specifications || [])].forEach((spec) => {
      specs.set(spec.name, spec.value);
    });
    return Array.from(specs.entries()).map(([key, value]) => ({ key, value }));
  }

  private extractManufacturerLeadTime(part: any): number {
    if (!part || !part.leadTime) {
      return 0;
    }

    const leadTime = part.leadTime.toString();
    const leadTimeMatch = leadTime.match(/(\d+)/);
    if (leadTimeMatch) {
      const leadTimeNumber = parseFloat(leadTimeMatch[0]);
      if (!isNaN(leadTimeNumber)) {
        return leadTimeNumber;
      }
    }
    return 0;
  }
}
