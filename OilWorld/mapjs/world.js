

//约定常量
var IndicatorValue = [1,2,3,4,5];
var dotSize = 15;
var dotColor1 = [253, 124, 231, 1];
var dotColor2 = [0, 255, 0, 1];
var dotColor3 = [255, 121, 0, 1];
var dotColor4 = [255, 0, 0, 1];
var dotColor5 = [253, 243, 124, 1];
var dotColorHide = [7,9,58,1];      //隐藏点，仅供查询用
var dotMaxSize = 5*2+8;     //点的最大半径
var highlightLineColor = [255,255,0,0.5];   //高亮国家的边界
var highlightAreaColor = [7,9,58,0];   //高亮国家面积

//变量
var riskResultJsonObj;

var map;
var mapURL_world = "http://localhost:6080/arcgis/rest/services/Oil/world/MapServer";
var mapService;
var flashGraphicsArr = new Array(0);        //所有需要闪烁的点
var keyMapRiskJsonStr = "";    //risk风险图层与数据库连接的键值对 jsonstr
var keyMapRiskJsonObj;
var riskLevel;      //风险级别
var highlightGraphic;   //当前正在高亮的国家graphic
var riskInfowindow;         //风险点超链接
var worldInfoWindow;    //国家超链接

require([
    "esri/map",
    "esri/layers/FeatureLayer",

    "esri/dijit/InfoWindowLite",
    "esri/InfoTemplate",
    "dijit/TooltipDialog",
    "dijit/popup",

    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",

    "esri/renderers/SimpleRenderer",
    "esri/renderers/UniqueValueRenderer",
    "esri/Color",
    "esri/graphic",

    "esri/tasks/FindTask",
    "esri/tasks/FindParameters",
    "esri/tasks/query",
    "esri/tasks/QueryTask",

    "dojo/_base/lang",
    "dojox/gfx/fx",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/domReady!"
], function (
    Map, FeatureLayer,
    InfoWindowLite,InfoTemplate,TooltipDialog,dijitPopup,
    SimpleLineSymbol, SimpleMarkerSymbol,SimpleFillSymbol,
    SimpleRenderer,UniqueValueRenderer, Color,Graphic,
    FindTask, FindParameters,Query, QueryTask,
    lang, fx, dom,domStyle
    ) {
    dojo.addOnLoad(initData);

    function initRiskPoint() {
        //var findTask, findParams;   //查询要素
        //findTask = new FindTask(mapURL_world);
        //findParams = new FindParameters();
        //findParams.returnGeometry = true;
        //findParams.layerIds = [0];
        //findParams.searchFields = ["AreaID"];
        //findParams.searchText = "0";    //
        //findTask.execute(findParams, showResults);

        var url = mapURL_world + "/0";
        var queryTask = new QueryTask(url);

        var query = new Query();
        query.returnGeometry = true;
        query.outFields = ["OBJECTID",
            "AreaID",
            "CountryID",
            "IndicatorID",
            "国家名称",
            "区域编码",
            "英文简称",
            "国家编码"
        ];
        query.where = "1=1";
        queryTask.execute(query, showResults);

        //设置样式
        var dotSymbol1 = new SimpleMarkerSymbol().setColor(new Color(dotColor1));
        var dotSymbol2 = new SimpleMarkerSymbol().setColor(new Color(dotColor2));
        var dotSymbol3 = new SimpleMarkerSymbol().setColor(new Color(dotColor3));
        var dotSymbol4 = new SimpleMarkerSymbol().setColor(new Color(dotColor4));
        var dotSymbol5 = new SimpleMarkerSymbol().setColor(new Color(dotColor5));

        function showResults(results) {
            //find results return an array of findResult.
            map.graphics.clear();
            //Build an array of attribute information and add each found graphic to the map
            for (var index = 0; index < results.features.length; index++) {                
                var graphic = results.features[index];
                var attr = graphic.attributes;
                var indicatorID = attr["IndicatorID"];
                var riskLevel = riskResultJsonObj[keyMapRiskJsonObj[parseInt(attr["OBJECTID"])]]["DigitResult"];
                //console.log(attr["OBJECTID"]);
                //console.log(riskResultJsonObj[keyMapRiskJsonObj[parseInt(attr["OBJECTID"])]]);
                switch (indicatorID) {
                    case 1:
                        graphic.setSymbol(dotSymbol1.setSize(riskLevel * 2 + 8));
                        break;
                    case 2:
                        graphic.setSymbol(dotSymbol2.setSize(riskLevel * 2 + 8));
                        break;
                    case 3:
                        graphic.setSymbol(dotSymbol3.setSize(riskLevel * 2 + 8));
                        break;
                    case 4:
                        graphic.setSymbol(dotSymbol4.setSize(riskLevel * 2 + 8));
                        break;
                    case 5:
                        graphic.setSymbol(dotSymbol5.setSize(riskLevel * 2 + 8));
                        break;
                    default:
                        graphic.setSymbol(dotSymbol1.setSize(dotSize));
                        break;
                }
                //infowindow设置
                var title = "<b>"+riskResultJsonObj[keyMapRiskJsonObj[parseInt(attr["OBJECTID"])]]["TextResult"]+"</b>";
                var content = "<b>区域编码：</b>"+riskResultJsonObj[keyMapRiskJsonObj[parseInt(attr["OBJECTID"])]]["AreaID"]+"<br>"
                    +"<b>国家编码：</b>"+riskResultJsonObj[keyMapRiskJsonObj[parseInt(attr["OBJECTID"])]]["CountryID"]+"<br>"
                    +"<b>风险等级：</b>"+riskResultJsonObj[keyMapRiskJsonObj[parseInt(attr["OBJECTID"])]]["DigitResult"]+"<br>";
                var infoTemplate = new InfoTemplate(title,content);
                graphic.setInfoTemplate(infoTemplate);

                map.graphics.add(graphic);

                if (graphic.symbol.size == dotMaxSize) {
                    flashGraphicsArr.push(graphic);
                }
            }

            //设置鼠标滑过显示查询框
            dojo.connect(map.graphics, "onMouseOver", function (evt) {
                var g = evt.graphic;
                if(g.geometry.type == "polygon"){
                    return;
                }
                map.infoWindow.setContent(g.getContent());
                map.infoWindow.setTitle(g.getTitle());
                map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
            });
            dojo.connect(map.graphics, "onClick", function (evt) {
                var g = evt.graphic;
                if(g.geometry.type != "point"){
                    return;
                }
                var countryID = evt.graphic.attributes["CountryID"];
                var indicatorID = evt.graphic.attributes["IndicatorID"];
                //window.open(riskResultJsonObj[keyMapRiskJsonObj[parseInt(evt.graphic.attributes["OBJECTID"])]]["url"]+"/web?query="+evt.graphic.attributes["英文简称"],"_blank");
                redirectByRiskInfo(countryID,indicatorID);

            });
            dojo.connect(map.graphics, "onMouseOut", function () {
                map.infoWindow.hide();
            });

            if (flashGraphicsArr.length > 0) {
                //console.log("flashGraphicsArr.length", flashGraphicsArr.length);
                flashRiskGraphics();
            }
        }
    }

    function flashRiskGraphics() {
        for (var index in flashGraphicsArr) {
            exeFlashGraphic(index);
        }
    }

    function exeFlashGraphic(index) {
        self.setInterval(function () {
            var graphic = flashGraphicsArr[index];
            var shape = graphic.getDojoShape();
            setTimeout(lang.partial(function () {
                fx.animateStroke({
                    shape: shape,
                    duration: 1000,
                    color: {
                        //start: "red",
                        start: graphic.symbol.color,
                        end: shape.strokeStyle.color
                    },
                    width: {
                        start: dotMaxSize,
                        end: shape.strokeStyle.width
                    }
                }).play();
            }), graphic, 500);
        }, 1500);
    }

    function initALLVariables() {
        //闪烁要素清空
        flashGraphicsArr.clear();
        //清空地图内容，再次添加
        if (map) {
            map.destroy();
        }
    }

    function initData(){
        //使用jQuery获取数据
        $(document).ready(function () {
            $.ajax({
                type: "POST",
                url: "WebService1.asmx/GetRiskResult",
                data: "{}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    var riskResultJsonStr = msg.d;
                    //$('#Content').html(riskResultJsonStr);
                    //处理json数据
                    riskResultJsonObj = JSON.parse(riskResultJsonStr).rows;
//                    console.log("riskResultJsonStr:",riskResultJsonStr);
                    //console.log("riskResultJsonObj:",riskResultJsonObj);
//                    console.log("riskResultJsonObj.rows:",riskResultJsonObj.rows[0]["IndicatorID"]);
//                    riskResultJsonObj.rows[0]["IndicatorID"] = 100;
//                    console.log("after riskResultJsonObj.rows:",riskResultJsonObj.rows[0]["IndicatorID"]);

                    initMap();
                }
            });
        });
    }

    function setLayerIndexDB() {
        var url = mapURL_world + "/0";
        var queryTask = new QueryTask(url);

        var query = new Query();
        query.returnGeometry = false;
        query.outFields = ["OBJECTID",
            "AreaID",
            "CountryID",
            "IndicatorID",
            "国家名称",
            "区域编码",
            "英文简称",
            "国家编码"
        ];
        query.where = "AreaID = '0'";
        queryTask.execute(query, showResults);

        function showResults(results) {
            var resultCount = results.features.length;
            for (var i = 0; i < resultCount; i++) {
                var attr = results.features[i].attributes;
                for (var index = 0;index<riskResultJsonObj.length;index++) {
                    if (riskResultJsonObj[index]["CountryID"] == attr["CountryID"] && riskResultJsonObj[index]["IndicatorID"] == attr["IndicatorID"]) {
                        keyMapRiskJsonStr = setJson(keyMapRiskJsonStr, attr["OBJECTID"], index);
                    }
                }
            }
            keyMapRiskJsonObj = JSON.parse(keyMapRiskJsonStr);  //转为JSON
            //console.log("keyMapRiskJsonObj:",keyMapRiskJsonObj);
        }

        initRiskPoint();
    }

    function initMap() {
        //initALLVariables();    // 初始化所有变量
        map = new Map("mapWorldDiv", {
            logo: false
        });
        //添加背景图层-----------
        var backgroundLayerService = new esri.layers.ArcGISDynamicMapServiceLayer(mapURL_world);
        map.addLayer(backgroundLayerService);

        //添加世界地图-----------
        var worldLayerService = new FeatureLayer(mapURL_world+"/1", {
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ["英文简称","CountryID"]
        });
        map.addLayer(worldLayerService);

        //鼠标滑过事件
        worldLayerService.on("click", function(evt){
            //console.log("you have clicked the country");
            //window.open("http://www.baidu.com/s?wd="+evt.graphic.attributes["英文简称"],"_blank");
            var countryID = evt.graphic.attributes["CountryID"];
            redirectByCountryInfo(countryID); //执行网页跳转
        });

        //初始化数据
        setLayerIndexDB();
//
        map.on("load", function(){
            map.graphics.enableMouseEvents();
            //map.graphics.on("mouse-out", closeDialog);
        });

    }

    //----------------风险点infowWindow----------
    function closeDialog() {
        dijitPopup.close(riskInfowindow);
    }

    //----------------------常用函数-----------------
    function genRandom() {
        return Math.floor(Math.random() * (5) + 1);
    }

    //-------------网页跳转WebService--------------------
    function redirectByRiskInfo(coutnryId,indicatorId) {
        //使用jQuery获取数据
        $(document).ready(function () {
            $.ajax({
                type: "POST",
                url: "WebService1.asmx/RedirectByRiskInfo",
                data: "{_CountryID:" + coutnryId + ",_IndicatorID:" + indicatorId + "}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    var url = msg.d;
                    window.open(url, "_blank");
                }
            });
        });
    }

    function redirectByCountryInfo(coutnryId) {
        //使用jQuery获取数据
        $(document).ready(function () {
            $.ajax({
                type: "POST",
                url: "WebService1.asmx/RedirectByCountryInfo",
                data: "{_CountryID:" + coutnryId + "}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (msg) {
                    var url = msg.d;
                    window.open(url,"_blank");
                }
            });
        });
    }

    //---------------------json----------------------
    //添加或者修改json数据
    function setJson(jsonStr,name,value)
    {
        if(!jsonStr)jsonStr="{}";
        var jsonObj = JSON.parse(jsonStr);
        jsonObj[name] = value;
        return JSON.stringify(jsonObj)
    }
    //删除数据
    function deleteJson(jsonStr,name)
    {
        if(!jsonStr)return null;
        var jsonObj = JSON.parse(jsonStr);
        delete jsonObj[name];
        return JSON.stringify(jsonObj)
    }


});