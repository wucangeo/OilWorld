<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="OilWorld.Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no"/>
    <title>World Map</title>
    <link rel="stylesheet" href="http://js.arcgis.com/3.13/esri/css/esri.css"/>

    <style type="text/css">
      html, body, #mapWorldDiv,form {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
      }
      body {
        background-color: #FFF;
        overflow: hidden;
        font-family: "Trebuchet MS";
      }
    </style>
    <script src="js/jquery.js" type="text/javascript"></script>
    <script src="js/json2.js" type="text/javascript"></script>    
    <script src="http://js.arcgis.com/3.13/" type="text/javascript"></script>
    <script type="text/javascript" src="mapjs/world.js"></script>    
    <script type="text/javascript">

    </script>
</head>
<body>
    <form id="form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePageMethods="true"></asp:ScriptManager>
    <div id="mapWorldDiv" ></div>
    </form>
    
</body>
</html>
