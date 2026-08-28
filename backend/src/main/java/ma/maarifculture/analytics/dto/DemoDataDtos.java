package ma.maarifculture.analytics.dto;

public final class DemoDataDtos {

    private DemoDataDtos() {
    }

    public record CatalogLoadResponse(
            boolean synthetic,
            int categoriesCreated,
            int authorsCreated,
            int publishersCreated,
            int suppliersCreated,
            int productsCreated,
            int productsAlreadyPresent,
            int initialMovementsCreated,
            int productsAvailable,
            String salesFile,
            String message) {
    }
}
