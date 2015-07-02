//约定常量
var IndicatorValue = [1,2,3,4,5];
var dotSize = 15;
var dotColor1 = [253, 124, 231, 1];
var dotColor2 = [0, 255, 0, 1];
var dotColor3 = [255, 121, 0, 1];
var dotColor4 = [255, 0, 0, 1];
var dotColor5 = [253, 243, 124, 1];

//变量
var map;
var mapURL_world = "http://localhost:6080/arcgis/rest/services/world/MapServer";
var mapService;

require([
    "esri/map", "esri/layers/FeatureLayer",
    "esri/InfoTemplate",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/renderers/UniqueValueRenderer",
    "esri/Color",
    "dojo/domReady!"
], function(
    Map, FeatureLayer, InfoTemplate,
    SimpleLineSymbol, SimpleMarkerSymbol,
    UniqueValueRenderer, Color
    )  {
    dojo.addOnLoad(initMap);
    function initMap() {
        //清空地图内容，再次添加
        if (map) {
            map.destroy();
        }
        map = new Map("mapWorldDiv", {
            logo: false
        });
        mapService = new esri.layers.ArcGISDynamicMapServiceLayer(mapURL_world);
        map.addLayer(mapService);

        var defaultSymbol = new SimpleMarkerSymbol(
            SimpleMarkerSymbol.STYLE_CIRCLE,
            10,
            new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_NULL,
                new Color(dotColor1),
                1
            ),
            new Color(dotColor1)
        );

        //create renderer
        //var renderer = new UniqueValueRenderer(defaultSymbol, "IndicatorID");
        var renderer = new UniqueValueRenderer(defaultSymbol, "IndicatorID");

        //add symbol for each possible value
        renderer.addValue(IndicatorValue[0], new SimpleMarkerSymbol().setColor(new Color(dotColor1)).setSize(dotSize));
        renderer.addValue(IndicatorValue[1], new SimpleMarkerSymbol().setColor(new Color(dotColor2)).setSize(dotSize));
        renderer.addValue(IndicatorValue[2], new SimpleMarkerSymbol().setColor(new Color(dotColor3)).setSize(dotSize));
        renderer.addValue(IndicatorValue[3], new SimpleMarkerSymbol().setColor(new Color(dotColor4)).setSize(dotSize));
        renderer.addValue(IndicatorValue[4], new SimpleMarkerSymbol().setColor(new Color(dotColor5)).setSize(dotSize));


        var featureLayer = new FeatureLayer("http://localhost:6080/arcgis/rest/services/world/MapServer/0");

        //featureLayer.setDefinitionExpression("STATE_NAME = 'Kansas'");
        featureLayer.setRenderer(renderer);
        map.addLayer(featureLayer);
    }
});