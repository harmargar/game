function CScoreBoard(iX,iY,oParentContainer){
    var _aRows;
    var _aNicknames;
    var _aScores;
    
    var _oContainer;
    var _oDoubleIcon;
    var _oParentContainer = oParentContainer;
    
    this._init = function(iX,iY){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
        
        this._initRows();
        
        _oContainer.regX = _oContainer.getBounds().width/2;
        _oContainer.regY = _oContainer.getBounds().height/2;
    };
    
    this._initRows = function(){
        //SCOREBOARD HEADER
        var oSpriteHeader = s_oSpriteLibrary.getSprite("header_scoreboard");
        var oHeader = createBitmap(oSpriteHeader);
        _oContainer.addChild(oHeader);

        var iWidth = 300;
        var iHeight = 36;
        var iTextX = 180;
        var iTextY = 28;
        var oTextNick = new CTLText(_oContainer, 
                    iTextX-iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    26, "center", "#fff", FONT, 1,
                    2, 2,
                    TEXT_NICK,
                    true, true, true,
                    false );
       
        var iWidth = 150;
        var iTextX = 450;
        var oTextScore = new CTLText(_oContainer, 
                    iTextX-iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    26, "center", "#fff", FONT, 1,
                    2, 2,
                    TEXT_SCORE,
                    true, true, true,
                    false );

        var iWidth = 80;
        var iTextX = 590;
        var oTextWin = new CTLText(_oContainer, 
                    iTextX-iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    26, "center", "#fff", FONT, 1,
                    2, 2,
                    TEXT_WIN,
                    true, true, true,
                    false );

        //SCOREBOARD ROWS
        var oSpriteBg = s_oSpriteLibrary.getSprite("row_scoreboard");
        var oData = {   // image to use
                        images: [oSpriteBg], 
                        // width, height & registration point of each sprite
                        frames: {width: oSpriteBg.width, height: oSpriteBg.height/4}, 
                        animations: {  state_idle:0,state_win_round:1,state_win_game:2,state_lose_round:3}
                        
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
        _aRows = new Array();
        _aNicknames = new Array();
        _aScores = new Array();
        var iY = oSpriteHeader.height;
        for(var i=0;i<s_iNumPlayers;i++){
            var oRow = createSprite(oSpriteSheet,"state_idle",0,0,oSpriteBg.width,oSpriteBg.height/4);
            oRow.y = iY;
            _oContainer.addChild(oRow);

            var iWidth = 300;
            var iHeight = 50;
            var iTextY = iY + 32;
            var oText = new CTLText(_oContainer, 
                        oTextNick.getX(), iTextY - iHeight/2, iWidth, iHeight, 
                        40, "center", "#fff", FONT, 1,
                        2, 2,
                        s_aPlayerNames[i],
                        true, true, true,
                        false );
           
            var iWidth = 150;
            var iHeight = 50;
            var szText = "0/"+SCORE_TO_REACH["player_"+s_iNumPlayers];
            var oTextScoreNum = new CTLText(_oContainer, 
                        oTextScore.getX(), oText.getY(), iWidth, iHeight, 
                        40, "center", "#fff", FONT, 1,
                        2, 2,
                        szText,
                        true, true, true,
                        false );
           
            iY += oSpriteBg.height/4;
            
            _aRows[i] = oRow;
            _aNicknames[i] = oText;
            _aScores[i] = oTextScoreNum;
        }
        
        _oDoubleIcon = createBitmap(s_oSpriteLibrary.getSprite("double_icon"));
        _oDoubleIcon.x = 554;
        _oContainer.addChild(_oDoubleIcon);
    };
    
    this.show = function(aScores,aStates,bRummy){
        if(bRummy){
            _oDoubleIcon.visible = true;
        }else{
            _oDoubleIcon.visible = false;
        }
        
        this.refreshBoard(aScores,aStates,bRummy);
        
        _oContainer.visible = true;
    };
    
    this.refreshBoard = function(aScores,aStates,bRummy){
        for(var i=0;i<s_iNumPlayers;i++){
            _aRows[i].gotoAndStop(aStates[i]);
            _aScores[i].refreshText( aScores[i]+"/"+SCORE_TO_REACH["player_"+s_iNumPlayers] );
            if(bRummy && aStates[i] === SCOREBOARD_WIN_ROUND){
                _oDoubleIcon.y = _aScores[i].getY();
            }
        }
    };
    
    this._init(iX,iY);
}