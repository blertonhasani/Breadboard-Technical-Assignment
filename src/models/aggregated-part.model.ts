import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

@ObjectType()
export class AggregatedPart {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  totalStock: number;

  @Field()
  manufacturerLeadTime: number;

  @Field()
  manufacturerName: string;

  @Field({ nullable: true })
  manufacturerPartNumber?: string; // Add manufacturerPartNumber field

  @Field(() => [Packaging])
  packaging: Packaging[];

  @Field()
  productDoc: string;

  @Field()
  productUrl: string;

  @Field()
  productImageUrl: string;

  @Field(() => [Specification])
  specifications: Specification[];

  @Field(() => [SupplierName])
  sourceParts: SupplierName[];
}

export enum SupplierName {
  ARROW = "Arrow",
  TTI = "TTI",
}

registerEnumType(SupplierName, { name: 'SupplierName' });

@ObjectType()
export class Packaging {
  @Field()
  type: string;

  @Field()
  minimumOrderQuantity: number;

  @Field()
  quantityAvailable: number;

  @Field()
  unitPrice: number;

  @Field(() => SupplierName)
  supplier: SupplierName;

  @Field(() => [PriceBreak])
  priceBreaks: PriceBreak[];

  @Field({ nullable: true })
  manufacturerLeadTime?: string;
}

@ObjectType()
export class PriceBreak {
  @Field()
  breakQuantity: number;

  @Field()
  unitPrice: number;

  @Field()
  totalPrice: number;
}

@ObjectType()
export class Specification {
  @Field()
  key: string;

  @Field()
  value: string;
}
