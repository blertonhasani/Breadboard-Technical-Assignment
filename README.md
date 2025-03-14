# Breadboard-Technical-Assignment

This API aggregates part data from multiple suppliers, including Arrow and TTI, and exposes a GraphQL endpoint to retrieve information about parts based on a part number.



## GraphQL API Endpoint

The API exposes a GraphQL endpoint where you can query part data. The following example shows how to query for part details using the part number `0510210200`.


## Getting Started

To get started with this project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/blertonhasani/Breadboard-Technical-Assignment.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the project locally:
   ```bash
   npm run start:dev
   ```

## Prerequisites

- Node.js (version X.X.X or higher)
- TypeScript



### Example Query:
```graphql
query {
  getAggregatedPart(partNumber: "0510210200") {
    name
    description
    totalStock
    manufacturerLeadTime
    manufacturerName
    manufacturerPartNumber
    sourceParts
    packaging {
      type
      minimumOrderQuantity
      quantityAvailable
      unitPrice
      priceBreaks {
        breakQuantity
        unitPrice
        totalPrice
      }
    }
    productDoc
    productUrl
    productImageUrl
    specifications {
      key
      value
    }
  }
}
