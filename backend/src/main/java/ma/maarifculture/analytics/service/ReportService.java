package ma.maarifculture.analytics.service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import ma.maarifculture.analytics.dto.DashboardDtos.DashboardResponse;
import ma.maarifculture.analytics.dto.ForecastDtos.RecommendationResponse;
import ma.maarifculture.analytics.dto.InventoryDtos.StockResponse;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

@Service
public class ReportService {
    private final DashboardService dashboard;
    private final InventoryService inventory;
    private final ForecastService forecasts;
    public ReportService(DashboardService dashboard, InventoryService inventory, ForecastService forecasts) {
        this.dashboard=dashboard;this.inventory=inventory;this.forecasts=forecasts;
    }
    public String inventoryCsv(boolean lowOnly){StringBuilder out=new StringBuilder("sku,title,current_stock,minimum_threshold,status\n");int page=0;do{var result=inventory.inventory(page++,100);for(StockResponse row:result.content()){if(lowOnly&&row.currentStock()>row.minimumThreshold())continue;out.append(csv(row.sku())).append(',').append(csv(row.title())).append(',').append(row.currentStock()).append(',').append(row.minimumThreshold()).append(',').append(row.currentStock()<=0?"OUT_OF_STOCK":row.currentStock()<=row.minimumThreshold()?"LOW_STOCK":"OK").append('\n');}if(result.last())break;}while(true);return out.toString();}
    public String recommendationsCsv(){StringBuilder out=new StringBuilder("sku,title,current_stock,reorder_point,recommended_quantity,status,explanation\n");int page=0;do{var result=forecasts.recommendations(null,page++,100);for(RecommendationResponse r:result.content())out.append(csv(r.sku())).append(',').append(csv(r.title())).append(',').append(r.currentStock()).append(',').append(r.reorderPoint()).append(',').append(r.recommendedQuantity()).append(',').append(r.status()).append(',').append(csv(r.explanation())).append('\n');if(result.last())break;}while(true);return out.toString();}
    public byte[] managementPdf(Instant start,Instant end,Long categoryId,String language,Long authorId,Long publisherId){DashboardResponse d=dashboard.dashboard(start,end,categoryId,language,authorId,publisherId);try(PDDocument document=new PDDocument();ByteArrayOutputStream output=new ByteArrayOutputStream()){PDPage page=new PDPage();document.addPage(page);try(PDPageContentStream content=new PDPageContentStream(document,page)){PDType1Font title=new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);PDType1Font normal=new PDType1Font(Standard14Fonts.FontName.HELVETICA);content.beginText();content.setFont(title,18);content.newLineAtOffset(50,750);content.showText("Maarif Analytics - Rapport de gestion");content.setFont(normal,11);for(String line:List.of("Periode: "+start+" - "+end,"Chiffre d'affaires: "+money(d.totalRevenue())+" MAD","Commandes: "+d.numberOfOrders(),"Unites vendues: "+d.unitsSold(),"Panier moyen: "+money(d.averageOrderValue())+" MAD","Stock total: "+d.currentStockQuantity(),"Valeur du stock: "+money(d.inventoryValue())+" MAD","Produits en stock faible: "+d.lowStockProducts(),"Produits en rupture: "+d.outOfStockProducts(),"Document genere automatiquement; donnees et previsions a interpreter avec prudence.")){content.newLineAtOffset(0,-28);content.showText(line);}content.endText();}document.save(output);return output.toByteArray();}catch(Exception e){throw new IllegalStateException("Impossible de générer le rapport PDF.",e);}}
    private String money(BigDecimal value){return value==null?"N/D":value.setScale(2).toPlainString();}
    private String csv(String value){String safe=value==null?"":value;if(safe.startsWith("=")||safe.startsWith("+")||safe.startsWith("-")||safe.startsWith("@"))safe="'"+safe;return "\""+safe.replace("\"","\"\"")+"\"";}
}
