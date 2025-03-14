import { Resolver, Query, Args } from '@nestjs/graphql';
import { AggregatedPart } from '../models/aggregated-part.model';
import { AggregatedPartService } from '../services/aggregated-part.service';

@Resolver(() => AggregatedPart)
export class AggregatedPartResolver {
  constructor(private readonly aggregatedPartService: AggregatedPartService) {}

  @Query(() => AggregatedPart, { nullable: true })
  async getAggregatedPart(
    @Args('partNumber', { type: () => String }) partNumber: string,
  ): Promise<AggregatedPart | null> {
    return this.aggregatedPartService.getAggregatedPart(partNumber);
  }
}
