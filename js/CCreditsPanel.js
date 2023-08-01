function CCreditsPanel(){
    var _oListenerLogo;
    var _oListenerBlock;
    var _oFade;
    var _oContainerPanel;
    var _oButExit;
    var _oLogo;
    var _oPanel;
    var _oContainer;
    var _pStartPanelPos;
    
    this._init = function(){
        
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        _oFade = new createjs.Shape();
        _oListenerBlock = _oFade.on("click",function(){});
        _oFade.alpha = 0;
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oContainer.addChild(_oFade);
        
        _oContainerPanel = new createjs.Container();
        _oContainerPanel.visible = false;
        _oContainer.addChild(_oContainerPanel);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        _oPanel = createBitmap(oSprite);        
        _oPanel.regX = oSprite.width/2;
        _oPanel.regY = oSprite.height/2;
        _oContainerPanel.addChild(_oPanel);
        _oListenerLogo = _oPanel.on("click",this._onLogoButRelease);
        
        _oContainerPanel.x = CANVAS_WIDTH/2;
        _oContainerPanel.y = CANVAS_HEIGHT/2;  
        _pStartPanelPos = {x: _oContainerPanel.x, y: _oContainerPanel.y};
       
        var iWidth = 450;
        var iHeight = 60;
        var iX = 0;
        var iY = -26;
        var oTitle = new CTLText(_oContainerPanel, 
                    iX-iWidth/2, iY - iHeight/2, iWidth, iHeight, 
                    40, "center", "#fff", FONT, 1,
                    2, 2,
                    TEXT_DEVELOPED,
                    true, true, true,
                    false );
       
        var iWidth = 450;
        var iHeight = 50;
        var iX = 0;
        var iY = 120;
        var oLink = new CTLText(_oContainerPanel, 
                    iX-iWidth/2, iY - iHeight/2, iWidth, iHeight, 
                    36, "center", "#fff", FONT, 1,
                    2, 2,
                    "www.codethislab.com",
                    true, true, true,
                    false );
       
        var oSprite = s_oSpriteLibrary.getSprite('ctl_logo');
        _oLogo = createBitmap(oSprite);
        
        _oLogo.regX = oSprite.width/2;
        _oLogo.regY = oSprite.height/2;
        _oLogo.y = 50;
        _oContainerPanel.addChild(_oLogo);
      
        var oSprite = s_oSpriteLibrary.getSprite('but_exit_credits');
        _oButExit = new CGfxButton(240, -160, oSprite, _oContainerPanel);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);
        
        _oFade.alpha = 0;
        createjs.Tween.get(_oFade).to({alpha:0.7}, 500).call(function(){
                                                    _oContainerPanel.alpha = 0;
                                                    _oContainerPanel.visible = true;
                                                    createjs.Tween.get(_oContainerPanel).to({alpha:1}, 300);
                                            }); 
    };
    
    this.unload = function(){
        createjs.Tween.get(_oContainer).to({alpha:0},500).call(function(){
            s_oStage.removeChild(_oContainer);

            _oButExit.unload();
        }); 
        
        _oFade.off("click",_oListenerBlock);
        _oPanel.off("click",_oListenerLogo);  
    };
    
    this._onLogoButRelease = function(){
        window.open("https://www.codethislab.com/","_blank");
    };
    
    this._init();
    
    
};


