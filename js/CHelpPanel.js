function CHelpPanel(oParentContainer){
    const NUM_PAGES = 4;
    var _iCurPage;
    var _iRightX;
    var _iLeftX;
    var _aPages;
    var _oListener;
    
    var _oTextPage;
    var _oTextTitle;
    var _oArrowLeft;
    var _oArrowRight;
    var _oButPlay;
    var _oFade;
    var _oContainerPanel;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    var _oThis = this;
    
    this._init = function(){
        _iCurPage = 0;
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oParentContainer.addChild(_oContainer);
        
        _oFade = new createjs.Shape();
        _oFade.alpha = 0;
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oListener = _oFade.on("click",function(){});
        _oContainer.addChild(_oFade);
        
        _oContainerPanel = new createjs.Container();
        _oContainerPanel.visible = false;
        _oContainer.addChild(_oContainerPanel);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box_wide");
        var oBg = createBitmap(oSpriteBg);
        oBg.x = CANVAS_WIDTH/2;
        oBg.y = CANVAS_HEIGHT/2;
        oBg.regX = oSpriteBg.width/2;
        oBg.regY = oSpriteBg.height/2;
        _oContainerPanel.addChild(oBg);
        
        this._createPages();
        
        var iWidth = 120;
        var iHeight = 70;
        var iX = CANVAS_WIDTH/2+370;
        var iY = CANVAS_HEIGHT/2-300;
        _oTextPage = new CTLText(_oContainerPanel, 
                    iX-iWidth, iY - iHeight/2, iWidth, iHeight, 
                    60, "right", "#fff", FONT, 1,
                    2, 2,
                    "1/"+NUM_PAGES,
                    true, true, true,
                    false );       
        
        var iWidth = 500;
        var iHeight = 70;
        var iX = CANVAS_WIDTH/2-370;
        var iY = CANVAS_HEIGHT/2-300;
        _oTextTitle = new CTLText(_oContainerPanel, 
                    iX, iY - iHeight/2, iWidth, iHeight, 
                    60, "left", "#fff", FONT, 1,
                    2, 2,
                    TEXT_HELP_TITLE[0],
                    true, true, true,
                    false );
                    
        
        _oButPlay = new CGfxButton(CANVAS_WIDTH/2 + 290,CANVAS_HEIGHT/2 + 250,s_oSpriteLibrary.getSprite("but_play"),_oContainerPanel);
        _oButPlay.addEventListener(ON_MOUSE_UP,this._onPlay,this);
        
        _oArrowLeft = new CGfxButton(CANVAS_WIDTH/2 - 450, CANVAS_HEIGHT/2,s_oSpriteLibrary.getSprite("arrow_left"),_oContainerPanel);
        _oArrowLeft.addEventListener(ON_MOUSE_UP,this._onLeft,this);
        
        _oArrowRight = new CGfxButton(CANVAS_WIDTH/2 + 450, CANVAS_HEIGHT/2,s_oSpriteLibrary.getSprite("arrow_right"),_oContainerPanel);
        _oArrowRight.addEventListener(ON_MOUSE_UP,this._onRight,this);
    };
    
    this.unload = function(){
        _oButPlay.unload();
        _oArrowLeft.unload();
        _oArrowRight.unload();
        _oFade.off("click",_oListener);
    };
    
    this.show = function(){
        _oContainer.visible = true;
        _oFade.alpha = 0;
        _oContainerPanel.alpha = 0;
        _oContainerPanel.visible = true;
        
        createjs.Tween.get(_oFade).to({alpha:0.7}, 500).call(function(){
                                                    
                                                    createjs.Tween.get(_oContainerPanel).to({alpha:1}, 300);
                                                }); 
    };
    
    this.hide = function(){
        _oContainer.visible = false;
    };
    
    this._createPages = function(){
        _iRightX = CANVAS_WIDTH/2;
        _iLeftX = -CANVAS_WIDTH/2;
        
        var oMask = new createjs.Shape();
        oMask.graphics.beginFill("rgba(255,255,0,0.01)").drawRect(CANVAS_WIDTH/2-400,CANVAS_HEIGHT/2-350,800,700);
        _oContainerPanel.addChild(oMask);
        
        _aPages = new Array();
        
        for(var i=0;i<NUM_PAGES;i++){
            var oContainer = new createjs.Container();
            oContainer.visible = false;
            oContainer.mask = oMask;
            _oContainerPanel.addChild(oContainer);
            
            _aPages[i] = oContainer;
        }
        
        //PAGE 1: GENERAL RULES
        var iWidth = 750;
        var iHeight = 120;
        var iX = CANVAS_WIDTH/2;
        var iY = CANVAS_HEIGHT/2-180;
        var oText = new CTLText(_aPages[0], 
                    iX - iWidth/2, iY - iHeight/2, iWidth, iHeight, 
                    28, "center", "#fff", FONT, 1,
                    2, 2,
                    TEXT_HELP_0+CARD_TO_DEAL["player_"+s_iNumPlayers]+" "+TEXT_CARDS+".",
                    true, true, true,
                    false );
        
        var aCards = s_oGameSettings.getShuffledCardDeck();
        var iX = CANVAS_WIDTH/2-310;
        for(var i=0;i<10;i++){
            var oCard = createBitmap(s_oSpriteLibrary.getSprite("card_"+aCards[i].frame));
            oCard.scaleX = oCard.scaleY = 0.55;
            oCard.x = iX;
            oCard.y = CANVAS_HEIGHT/2-100;
            _aPages[0].addChild(oCard);
            
            iX += CARD_WIDTH_OFFSET_IN_HAND*oCard.scaleX;
        }
        
        
        //PAGE 2: STACK AND WASTE PILE
        var iWidth = 750;
        var iHeight = 100;
        var iX = CANVAS_WIDTH/2;
        var iY = CANVAS_HEIGHT/2-200;
        var oText = new CTLText(_aPages[1], 
                    iX - iWidth/2, iY - iHeight/2, iWidth, iHeight, 
                    22, "center", "#fff", FONT, 1,
                    2, 2,
                    TEXT_HELP_1,
                    true, true, true,
                    false );
       
        
        for(var k=0;k<s_oGameSettings.getStartingDeckLength();k++){
            var pStart = new CVector2( -(0.2*k), -(0.2*k));
            
            var oCard = createBitmap(s_oSpriteLibrary.getSprite("card_54"));
            oCard.x = CANVAS_WIDTH/2 - 150 + pStart.getX();
            oCard.y = CANVAS_HEIGHT/2 -140 + pStart.getY();
            oCard.scaleX = oCard.scaleY = 0.6;
            _aPages[1].addChild(oCard);
        } 
        
        var oCard = createBitmap(s_oSpriteLibrary.getSprite("card_"+Math.floor(Math.random()*50)));
        oCard.x = CANVAS_WIDTH/2 + 20 + pStart.getX();
        oCard.y = CANVAS_HEIGHT/2 -140;
        oCard.scaleX = oCard.scaleY = 0.6;
        _aPages[1].addChild(oCard);
            
        var iWidth = 750;
        var iHeight = 50;
        var iX = CANVAS_WIDTH/2;
        var iY = CANVAS_HEIGHT/2+107;
        var oText = new CTLText(_aPages[1], 
                    iX - iWidth/2, iY - iHeight/2, iWidth, iHeight, 
                    22, "center", "#fff", FONT, 1,
                    2, 2,
                    TEXT_HELP_2,
                    true, true, true,
                    false );
       
        
        //PAGE 3: MELDS
        var iWidth = 750;
        var iHeight = 100;
        var iX = CANVAS_WIDTH/2;
        var iY = CANVAS_HEIGHT/2-198;
        var oText = new CTLText(_aPages[2], 
                    iX - iWidth/2, iY - iHeight/2, iWidth, iHeight, 
                    28, "center", "#fff", FONT, 1,
                    2, 2,
                    TEXT_HELP_3,
                    true, true, true,
                    false );
       
        
        var iX = CANVAS_WIDTH/2 - 350;
        
        var iWidth = 200;
        var iHeight = 40;
        var iTextX = iX + 90;
        var iY = CANVAS_HEIGHT/2+30;
        var oText = new CTLText(_aPages[2], 
                    iTextX - iWidth/2, iY - iHeight/2, iWidth, iHeight, 
                    26, "center", "#fff", FONT, 1,
                    2, 2,
                    TEXT_TRIS,
                    true, true, true,
                    false );
        
        var aLabels = ["card_12","card_25","card_51"];
        for(var j=0;j<3;j++){
            var oCard = createBitmap(s_oSpriteLibrary.getSprite(aLabels[j]));
            oCard.x = iX;
            oCard.y = CANVAS_HEIGHT/2 -140;
            oCard.scaleX = oCard.scaleY = 0.4;
            _aPages[2].addChild(oCard);
            
            iX += CARD_WIDTH_OFFSET_IN_HAND*oCard.scaleX;
        }
        
        
        iX = CANVAS_WIDTH/2-120;
        
        var iWidth = 200;
        var iHeight = 40;
        var iTextX = iX + 110;
        var iY = CANVAS_HEIGHT/2+30;
        var oText = new CTLText(_aPages[2], 
                    iTextX - iWidth/2, iY - iHeight/2, iWidth, iHeight, 
                    26, "center", "#fff", FONT, 1,
                    2, 2,
                    TEXT_POKER,
                    true, true, true,
                    false );
        
        var aLabels = ["card_0","card_13","card_26","card_39"];
        for(var j=0;j<4;j++){
            var oCard = createBitmap(s_oSpriteLibrary.getSprite(aLabels[j]));
            oCard.x = iX;
            oCard.y = CANVAS_HEIGHT/2 -140;
            oCard.scaleX = oCard.scaleY = 0.4;
            _aPages[2].addChild(oCard);
            
            iX += CARD_WIDTH_OFFSET_IN_HAND*oCard.scaleX;
        }
        
        
        var iX = CANVAS_WIDTH/2 + 160;

        var iWidth = 200;
        var iHeight = 40;
        var iTextX = iX + 90;
        var iY = CANVAS_HEIGHT/2+30;
        var oText = new CTLText(_aPages[2], 
                    iTextX - iWidth/2, iY - iHeight/2, iWidth, iHeight, 
                    26, "center", "#fff", FONT, 1,
                    2, 2,
                    TEXT_STRAIGHT,
                    true, true, true,
                    false );
       
        var aLabels = ["card_10","card_11","card_12"];
        for(var j=0;j<3;j++){
            var oCard = createBitmap(s_oSpriteLibrary.getSprite(aLabels[j]));
            oCard.x = iX;
            oCard.y = CANVAS_HEIGHT/2 -140;
            oCard.scaleX = oCard.scaleY = 0.4;
            _aPages[2].addChild(oCard);
            
            iX += CARD_WIDTH_OFFSET_IN_HAND*oCard.scaleX;
        }
        
        if(MIN_OPENING_VALUE > 0){
            var iWidth = 750;
            var iHeight = 50;
            var iX = CANVAS_WIDTH/2;
            var iY = CANVAS_HEIGHT/2+107;
            var oText = new CTLText(_aPages[2], 
                        iX - iWidth/2, iY - iHeight/2, iWidth, iHeight, 
                        24, "center", "#fff", FONT, 1,
                        2, 2,
                        TEXT_HELP_8 + " "+ MIN_OPENING_VALUE + " " + TEXT_POINTS,
                        true, true, true,
                        false );           
        }
        
        
        
        //PAGE 4: SCORING
        var szRummyText = GOING_RUMMY_RULE?TEXT_HELP_9:"";
        var iWidth = 750;
        var iHeight = 120;
        var iX = CANVAS_WIDTH/2;
        var iY = CANVAS_HEIGHT/2-190;
        var oText = new CTLText(_aPages[3], 
                    iX - iWidth/2, iY - iHeight/2, iWidth, iHeight, 
                    22, "center", "#fff", FONT, 1,
                    2, 2,
                    TEXT_HELP_4+" "+SCORE_ACE+ " " +TEXT_HELP_5+" "+szRummyText,
                    true, true, true,
                    false );

        var iX = CANVAS_WIDTH/2-140;
        var iTotScore = 0;
        for(var i=0;i<5;i++){
            var oCard = createBitmap(s_oSpriteLibrary.getSprite("card_"+aCards[i].frame));
            oCard.scaleX = oCard.scaleY = 0.45;
            oCard.x = iX;
            oCard.y = CANVAS_HEIGHT/2-120;
            _aPages[3].addChild(oCard);
            
            
            var iRank = aCards[i].rank;
            if(iRank === ACE_VALUE){
                iRank = SCORE_ACE;
            }else if(iRank === JOKER_VALUE){
                iRank = SCORE_JOKER;
            }else if(iRank>10){
                iRank = 10;
            }
            
            var iWidth = 32;
            var iHeight = 30;
            var iTextX = iX + 40;
            var iY = oCard.y + 180;
            var oText = new CTLText(_aPages[3], 
                        iTextX - iWidth/2, iY - iHeight/2, iWidth, iHeight, 
                        22, "center", "#fff", FONT, 1,
                        2, 2,
                        iRank,
                        true, true, true,
                        false );
           
            iTotScore += iRank;
            iX += CARD_WIDTH_OFFSET_IN_HAND*oCard.scaleX;
        }
        
        var iWidth = 150;
        var iHeight = 30;
        var iTextX = iX + 40;
        var iY = oCard.y + 180;
        var oText = new CTLText(_aPages[3], 
                    iTextX, iY - iHeight/2, iWidth, iHeight, 
                    22, "left", "#fff", FONT, 1,
                    2, 2,
                    ":   "+iTotScore+" "+TEXT_POINTS,
                    true, true, true,
                    false );

        var iWidth = 750;
        var iHeight = 30;
        var iX = CANVAS_WIDTH/2;
        var iY = CANVAS_HEIGHT/2+100;
        var oText = new CTLText(_aPages[3], 
                    iX - iWidth/2, iY - iHeight/2, iWidth, iHeight, 
                    24, "center", "#fff", FONT, 1,
                    2, 2,
                    TEXT_HELP_6+" "+SCORE_TO_REACH["player_"+s_iNumPlayers]+ " " +TEXT_HELP_7,
                    true, true, true,
                    false );
        
        
        _aPages[0].visible = true;
    };
    
    this._onLeft = function(){
        var iPrevPage = _iCurPage;
        _iCurPage--;
        if(_iCurPage <0){
            _iCurPage = NUM_PAGES-1;
        }
        
        _aPages[_iCurPage].x = _iLeftX;
        _aPages[_iCurPage].visible = true;
        createjs.Tween.get(_aPages[iPrevPage]).to({x:_iRightX}, 500, createjs.Ease.cubicOut).call(function(){_aPages[iPrevPage].visible = false;});
        createjs.Tween.get(_aPages[_iCurPage]).to({x:0}, 500, createjs.Ease.cubicOut).call(function(){
                                                                                            _oTextTitle.refreshText( TEXT_HELP_TITLE[_iCurPage] );
                                                                                            _oTextPage.refreshText( (_iCurPage+1)+"/"+NUM_PAGES );
                                                                                });
    };
    
    this._onRight = function(){
        var iPrevPage = _iCurPage;
        _iCurPage++;
        if(_iCurPage===NUM_PAGES){
            _iCurPage = 0;
        }
        
        _aPages[_iCurPage].x = _iRightX;
        _aPages[_iCurPage].visible = true;
        createjs.Tween.get(_aPages[iPrevPage]).to({x:_iLeftX}, 500, createjs.Ease.cubicOut).call(function(){_aPages[iPrevPage].visible = false;});
        createjs.Tween.get(_aPages[_iCurPage]).to({x:0}, 500, createjs.Ease.cubicOut).call(function(){
                                                                                            _oTextTitle.refreshText( TEXT_HELP_TITLE[_iCurPage] );
                                                                                            _oTextPage.refreshText( (_iCurPage+1)+"/"+NUM_PAGES );
                                                                                });
    };
    
    this._onPlay = function(){
        _oThis.hide();
        s_oGame.exitFromHelpPanel();
    };
    
    this._init();
}