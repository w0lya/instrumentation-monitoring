
var socket = io();

var requestLogViewApp = {};
requestLogViewApp.configuration = {
    dataEndPoint: "http://localhost:3000/messages"    
};

requestLogViewApp.app = new Vue({
  el: '#requestInfo',
  
  data: {
      RequestLogItems: [],
      Stats: {
          AvgResponseSize : 0,
          MinResponseSize : 0,
          MaxResponseSize : 0,
          ResponseSizeSum : 0
      }
  },   

  // Initialize.
  mounted: function() {    
    
    socket.on('message', this.addMessage)
    
    this.getMessages();       
  },

  methods: {
      
      // Retrieve all the request data from DB  .
      getMessages : function () {
          
        var options = {
            url         :   requestLogViewApp.configuration.dataEndPoint,
            method      :   "GET",
            dataType    :   'json'                            
        };     
        
        $.ajax(options)
            .done(data => {  
                
                Vue.set(this._data, 'RequestLogItems', data.sort((a,b) => b.TimeStamp - a.TimeStamp).reverse());

                this.calculateStats();   
            })
            .fail( (jqXHR, textStatus, errorThrown)  => {                    
                console.log(jqXHR.status); 
                console.log(errorThrown);     
            });   
      },

      // Add new request info item to the top of the table.
      addMessage : function (message) {        
        
        this.updateStats(message.ResponseBodySize);

        this._data.RequestLogItems.unshift(message);        
        
      },

      // Initial calculation of request info stats on load.
      calculateStats : function () {       

        var responseSizes = this._data.RequestLogItems.map((x) => x.ResponseBodySize);

        if (responseSizes.length > 0) {

          this._data.Stats.MinResponseSize = Math.min(...responseSizes);

          this._data.Stats.MaxResponseSize = Math.max(...responseSizes);

          this._data.Stats.ResponseSizeSum =  responseSizes.reduce((acc, currentValue) => acc + currentValue);

          this._data.Stats.AvgResponseSize = this._data.Stats.ResponseSizeSum / responseSizes.length;
        }
      }, 
      
      // Update the stats when a new request info item is added.
      updateStats : function(newResponseBodySize) {
        
        var items = this._data.RequestLogItems;

        this._data.Stats.MinResponseSize = 
          newResponseBodySize >= this._data.Stats.MinResponseSize ? this._data.Stats.MinResponseSize : newResponseBodySize;

        this._data.Stats.MaxResponseSize = 
          newResponseBodySize <= this._data.Stats.MaxResponseSize ? this._data.Stats.MaxResponseSize : newResponseBodySize;

        this._data.Stats.ResponseSizeSum = this._data.Stats.ResponseSizeSum + newResponseBodySize;

        this._data.Stats.AvgResponseSize = this._data.Stats.ResponseSizeSum / (items.length + 1);
      }      
  }
})

