﻿//------------------------------------------------------------------------------
// <auto-generated>
//     此代码由工具生成。
//     运行时版本:4.0.30319.18444
//
//     对此文件的更改可能会导致不正确的行为，并且如果
//     重新生成代码，这些更改将会丢失。
// </auto-generated>
//------------------------------------------------------------------------------

namespace OilWorld.ServiceReference1 {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="ServiceReference1.WebService1Soap")]
    public interface WebService1Soap {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/GetRiskResult", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        string GetRiskResult();
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/RedirectByRiskInfo", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        string RedirectByRiskInfo(string _CountryID, string _IndicatorID);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/RedirectByCountryInfo", ReplyAction="*")]
        [System.ServiceModel.XmlSerializerFormatAttribute(SupportFaults=true)]
        string RedirectByCountryInfo(string _CountryID);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface WebService1SoapChannel : OilWorld.ServiceReference1.WebService1Soap, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class WebService1SoapClient : System.ServiceModel.ClientBase<OilWorld.ServiceReference1.WebService1Soap>, OilWorld.ServiceReference1.WebService1Soap {
        
        public WebService1SoapClient() {
        }
        
        public WebService1SoapClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public WebService1SoapClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public WebService1SoapClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public WebService1SoapClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public string GetRiskResult() {
            return base.Channel.GetRiskResult();
        }
        
        public string RedirectByRiskInfo(string _CountryID, string _IndicatorID) {
            return base.Channel.RedirectByRiskInfo(_CountryID, _IndicatorID);
        }
        
        public string RedirectByCountryInfo(string _CountryID) {
            return base.Channel.RedirectByCountryInfo(_CountryID);
        }
    }
}
