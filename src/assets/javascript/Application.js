// declare the namespace for this example
var shape_designer = {
		figure:{
			
		},
		filter:{
			
		},
		dialog:{
			
		},
		policy:{
			
		},
		storage:{
			
		}
};

/**
 * 
 * The **GraphicalEditor** is responsible for layout and dialog handling.
 * 
 * @author Andreas Herz
 */

shape_designer.Application = Class.extend(
{
    NAME : "shape_designer.Application", 

    
    /**
     * @constructor
     * 
     * @param {String} canvasId the id of the DOM element to use as paint container
     */
    init : function()
    {
        this.currentFile = null;
        
        this.storage = new shape_designer.storage.BackendStorage();
        this.view    = new shape_designer.View(this, "canvas");
        this.toolbar = new shape_designer.Toolbar(this, "toolbar",  this.view );
        this.layer   = new shape_designer.Layer(this, "layer_elements", this.view );
        this.filter  = new shape_designer.FilterPane(this, "filter_actions", this.view );
        this.view.installEditPolicy(new shape_designer.policy.SelectionToolPolicy());

        // Get the authorization code from the url that was returned by GitHub
        var _this = this;
        var url = window.location.href;
        var code = this.getParam("code");
        if (code!==null) {
           $.getJSON(conf.githubAuthenticateCallback+code, function(data) {
               _this.storage.login(data.token, $.proxy(function(success){
                   _this.toolbar.onLogginStatusChanged(success);
               },this));
           });
        }
        about.hide();
 	},
 	
    getParam: function( name )
    {
      name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
      var regexS = "[\\?&]"+name+"=([^&#]*)";
      var regex = new RegExp( regexS );
      var results = regex.exec( window.location.href );
      if( results === null )
        return null;
      
      return results[1];
    },
 	
	fileNew: function( successCallback, errorCallback, abortCallback)
    {
        this.view.clear();
        this.storage.currentFile = null;
        this.storage.fileNew(
            // success callback
            //
            $.proxy(function(file){
                this.currentFile = file;
                document.title = file.title;
                alert("Created");
            },this),
            errorCallback,
            abortCallback);
    },

    fileOpen: function()
    {
        new shape_designer.dialog.FileOpen(this.storage).show(

            // success callback
            $.proxy(function(fileData){
                try{
                    this.view.clear();
                    var reader = new draw2d.io.json.Reader();
                    reader.unmarshal(this.view, fileData);
                    this.view.getCommandStack().markSaveLocation();
                }
                catch(e){
                    this.view.reset();
                }
            },this));
    },

	fileSave: function()
    {
        new shape_designer.dialog.FileSave(this.storage).show(this.view);
	}
});
