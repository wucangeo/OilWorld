using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

using System.Web.Configuration;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.Script.Serialization;
using System.Data;
using System.Text;
using System.Drawing;
using System.Web.Script.Services;
using System.Web.UI;

namespace OilWorld
{
    /// <summary>
    /// WebService1 的摘要说明
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消对下行的注释。
    [System.Web.Script.Services.ScriptService]
    public class WebService1 : System.Web.Services.WebService
    {
        [WebMethod]
        //[ScriptMethod(UseHttpGet = true)]
        public string GetRiskResult()
        {
            string json = "";

            //读取配置文件中的链接字符串
            String connectionString = ConfigurationManager.ConnectionStrings["Conn"].ConnectionString;
            //创建SQLConnection对象
            SqlConnection sqlCon = new SqlConnection(connectionString);
            //SQL语句
            string sqlStr = "select * from [Sys_RiskResult]";
            try
            {
                SqlDataAdapter da = new SqlDataAdapter(sqlStr, sqlCon);
                DataSet ds = new DataSet();
                da.Fill(ds, "Sys_RiskResult");

                //JavaScriptSerializer jss = new JavaScriptSerializer();
                json = Convert.DataTabletoString(ds.Tables[0]);
                sqlCon.Close();
            }
            catch (SqlException sqlex)
            {
                json = sqlex.Message;
            }
            finally
            {
                //关闭连接
                if (sqlCon != null)
                {
                    sqlCon.Close();
                }
            }
            return "{\"rows\":" + json + "}";
            //return json;
        }

        [WebMethod]
        public string RedirectByRiskInfo(string _CountryID,string _IndicatorID)
        {
            //要返回的链接
            string urlStr = "";

            //读取配置文件中的链接字符串
            String connectionString = ConfigurationManager.ConnectionStrings["Conn"].ConnectionString;
            //创建SQLConnection对象
            SqlConnection sqlCon = new SqlConnection(connectionString);
            //SQL语句
            string sqlStr = "SELECT [url]  FROM [oil].[dbo].Sys_RiskResult where [CountryID] = '"+_CountryID+"' and IndicatorID  = '"+_IndicatorID+"'";
            try
            {
                SqlDataAdapter da = new SqlDataAdapter(sqlStr, sqlCon);
                DataSet ds = new DataSet();
                da.Fill(ds, "Sys_RiskResult");


                //遍历结果
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    urlStr = row[0].ToString();
                    //HttpContext.Current.Response.Redirect(row["url"].ToString(), false);
                }               
            }
            catch //(SqlException sqlex)
            {
                //Resqlex.Message;
            }
            finally
            {
                //关闭连接
                if (sqlCon != null)
                {
                    sqlCon.Close();
                }
            }
            return urlStr;
        }

        [WebMethod]
        public string RedirectByCountryInfo(string _CountryID)
        {
            //需要跳转的链接
            string urlStr = "";

            //读取配置文件中的链接字符串
            String connectionString = ConfigurationManager.ConnectionStrings["Conn"].ConnectionString;
            //创建SQLConnection对象
            SqlConnection sqlCon = new SqlConnection(connectionString);
            //SQL语句
            string sqlStr = "SELECT [url]  FROM [oil].[dbo].[Rel_Area_Country] where [CountryID] = '" + _CountryID + "'";
            try
            {
                SqlDataAdapter da = new SqlDataAdapter(sqlStr, sqlCon);
                DataSet ds = new DataSet();
                da.Fill(ds, "Sys_RiskResult");


                //遍历结果
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    urlStr = row[0].ToString();
                    break;
                    //HttpContext.Current.Response.Redirect(urlStr, false);
                }
            }
            catch //(SqlException sqlex)
            {
                //Resqlex.Message;
            }
            finally
            {
                //关闭连接
                if (sqlCon != null)
                {
                    sqlCon.Close();
                }
            }
            return urlStr;
        }
    }
}
