
var screen = $(window).width(); //获取屏幕宽度

var clearTime1;

var clearTime4;

var clearTime5;

var clearTime6;

var temporary_flag = {player:-1,cancle:0} //临时标志位

var xunhantt = 30;

var new_that;

// 准备打出的牌信息,poker：牌；type：类型；max：最大值
var ready_poker = {poker:[],type:0,max:0};

// 上一次打出的牌信息,poker：牌；type：类型；max：最大值
var desktop_poker = {poker:[],type:0,max:0};

var score = {player0:0,player1:0,player2:0};


function LandLoads(poker,flag){

    $('#boom')[0].pause();
    // console.log(this);

    this.setInfo();         //初始化游戏信息
    // ready_poker = {poker:[],type:0,max:0};

    this.InitFrame(poker);     //初始化牌堆

    this.InitEvents(poker);        //初始化牌事件

}


LandLoads.prototype = {

    constructor:LandLoads,

    /*--------初始化游戏信息函数----------------------*/

    setInfo:function(){


        // var that =this;

        // 玩家信息
        // 
        this.all_player = [];


        // name:名字;integeral:积分;role:1为地主,0为农民;multiple:倍数;alarm_flag:警报显示

        this.all_player.push({name:'柯南',integral:100,role:0,poker:[],multiple:1,alarm_flag:0});

        this.all_player.push({name:'小灰',integral:100,role:0,poker:[],multiple:1,alarm_flag:0});

        this.all_player.push({name:'小兰',integral:100,role:0,poker:[],multiple:1,alarm_flag:0});

        // 初始化54张扑克牌的数据

        this.poker_arr = ['14_0','15_0'];

        for(var i=1;i<14;i++){

            for(var j=0;j<4;j++){

                this.poker_arr.push(i+'_'+j);

            }

        }

        // 地主牌

        this.landlord_poker = [];

        // 准备打出的牌信息,poker：牌；type：类型；max：最大值

        ready_poker = {poker:[],type:0,max:0};

        // 上一次打出的牌信息,poker：牌；type：类型；max：最大值

        desktop_poker = {poker:[],type:0,max:0};

        // 标志位,ready_click:开始始点击次数,flg：叫地主,over_land_grab:是否是叫完地主；boss：谁是地主；player:当前玩家；cancle：不出次数;alarm_music_flag:音乐警报标志位

        this.flag = {ready_click:0,flg:0,over_land_grab:false,boss:-1,player:-1,cancle:0,alarm_music_flag:true};

        // 叫地主标志位,call:全部人叫的次数,player:为玩家叫的次数

        this.landload_flag = {all:0,player0:0,player1:0,player2:0,current_player:0};

        this.drag = {flag:0,start_left:0,end_left:0,current_left:0}      //拖拽数据


    },


    /*--------初始化游戏界面函数----------------------*/

    InitFrame:function(poker){
      

        for(var i=0; i<54; i++){

            poker.$all_poker.append('<li class="back"></li>');  //生成54个li

        }

        poker.$alarm.hide();

        poker.$mingpai.hide();

        poker.$back = $('.back');



    },

    /*----------初始化点击事件-----------------------------------*/


    InitEvents:function(poker){

        var that = this;

        /*---------洗牌,发牌点击事件-------------------------*/

        poker.$mid_top.on('click','li',function(){

            if(that.flag.ready_click == 0){

                that.pokerUp();

            }else if(that.flag.ready_click == 1){

                that.clearPoker()

            }else if(that.flag.ready_click == 2){

                that.createPlayerPokerData();

                that.deal(0,0);
                that.sort_showPoker(that.all_player[0].poker);
                that.sort_showPoker(that.all_player[2].poker);

            }

            that.flag.ready_click++;

        });

         /*---------名牌特效-----------------------------------------------*/
         poker.$left.on('click','.mingpai',function(){

            for (var i = 0; i < 17; i++) {

                that.fanzhuan( poker.$play1_poker_li.eq(i), poker.$play1_poker_li.eq(i).children('.list'));
            
            };

            that.autoclick(poker.$play3_poker_li,0);

            setTimeout(that.play1_left(),1000);

         });

         poker.$right.on('click','.mingpai',function(){

            for (var i = 0; i < 17; i++) {

                that.fanzhuan(poker.$play3_poker_li.eq(i), poker.$play3_poker_li.eq(i).children('.list'));

            };

            that.autoclick(poker.$play3_poker_li,0);

            setTimeout(that.play3_right(),1000);

         });


        /*---------叫地主绑定事件-----------------------------------------------*/

        /*---------player0叫地主绑定事件----------------------------------------*/
        


        poker.$button_container.eq(0).on('click','.land_grab',function(){
            clearInterval(clearTime1);
            if(that.landload_flag.player1 == -1){

                poker.$button_container.eq(2).show();

            }else{

                poker.$button_container.eq(1).show();

                var time = $('.call_clock').eq(1).attr('value',30);

                clearTime1 = setInterval(function(){
                            var time = $('.call_clock').eq(1).attr('value');
                            $('.call_clock').eq(1).attr('value',time-1);
                            if(time==0){
                                $('.not_call').eq(1).trigger("click");
                            }

                            console.log('1:'+time)
                        },1000);

            }

            // clearInterval(clearTime1);
            poker.$button_container.eq(0).hide();
            

            that.landload_flag.player0++;

            that.landload_flag.all++;

            that.judgeLandload(poker);                                               //叫地主判断函数

        }).on('click','.not_call',function(){
            clearInterval(clearTime1);
            poker.$button_container.eq(1).show();
            var time = $('.call_clock').eq(1).attr('value',30);
            clearTime1 = setInterval(function(){
                            var time = $('.call_clock').eq(1).attr('value');
                            $('.call_clock').eq(1).attr('value',time-1);
                            if(time==0){
                                $('.not_call').eq(1).trigger("click");
                            }

                            console.log('1:'+time)
                        },1000);

            
            poker.$button_container.eq(0).hide();
            

            that.landload_flag.player0 = -1;

            that.judgeLandload(poker);   
        });

        /*---------player1叫地主绑定事件----------------------------------------*/

        poker.$button_container.eq(1).on('click','.land_grab',function(){
            clearInterval(clearTime1);

            if(that.landload_flag.player2 == -1){

                poker.$button_container.eq(0).show();

            }else{

                poker.$button_container.eq(2).show();
                var time = $('.call_clock').eq(2).attr('value',30);
                clearTime1 = setInterval(function(){
                            var time = $('.call_clock').eq(2).attr('value');
                            $('.call_clock').eq(2).attr('value',time-1);
                            if(time==0){
                                $('.not_call').eq(2).trigger("click");
                            }

                            console.log('2:'+time)
                        },1000);

            }

            
            poker.$button_container.eq(1).hide();
            

            that.landload_flag.player1++;

            that.landload_flag.all++;

            that.judgeLandload(poker);

        }).on('click','.not_call',function(){
            clearInterval(clearTime1);
            poker.$button_container.eq(2).show();
            var time = $('.call_clock').eq(2).attr('value',30);
            clearTime1 = setInterval(function(){
                            var time = $('.call_clock').eq(2).attr('value');
                            $('.call_clock').eq(2).attr('value',time-1);
                            if(time==0){
                                $('.not_call').eq(2).trigger("click");
                            }
                            console.log('2:'+time)
                        },1000);


            poker.$button_container.eq(1).hide();
            

            that.landload_flag.player1 = -1;

            that.judgeLandload(poker);   

        });

        /*---------player2叫地主绑定事件----------------------------------------*/
      
        poker.$button_container.eq(2).on('click','.land_grab',function(){
            clearInterval(clearTime1);

            if(that.landload_flag.player0 == -1){

                poker.$button_container.eq(1).show();
        
            }else{

                poker.$button_container.eq(0).show();
                var time = $('.call_clock').eq(0).attr('value',30);
                clearTime1 = setInterval(function(){
                            var time = $('.call_clock').eq(0).attr('value');
                            $('.call_clock').eq(0).attr('value',time-1);
                            if(time==0){
                                $('.not_call').eq(0).trigger("click");
                            }
                            console.log('0:'+time)
                        },1000);

            }

            poker.$button_container.eq(2).hide();

            that.landload_flag.player2++;

            that.landload_flag.all++;

            that.judgeLandload(poker);

        }).on('click','.not_call',function(){
         clearInterval(clearTime1);
            poker.$button_container.eq(0).show();
            var time = $('.call_clock').eq(0).attr('value',30);
            clearTime1 = setInterval(function(){
                            var time = $('.call_clock').eq(0).attr('value');
                            $('.call_clock').eq(0).attr('value',time-1);
                            if(time==0){
                                $('.not_call').eq(0).trigger("click");
                            }

                            console.log('0:'+time)
                        },1000);

            poker.$button_container.eq(2).hide();

            that.landload_flag.player2 = -1;

            that.judgeLandload(poker);   

        });

        /*---------叫地主绑定事件结束--------------------------------------------*/

        /*---------出牌不出绑定事件结束--------------------------------------------*/

        /*---------player0出牌不出绑定事件----------------------------------------*/

        poker.$play_event.eq(0).on('click','.play',function(){

            clearInterval(clearTime4);

            clearInterval(clearTime5);
          
            that.play(poker);


        }).on('click','.no_play',function(){

            clearInterval(clearTime4);

            clearInterval(clearTime5);
           
            that.noPlay();

        });

        /*---------player1出牌不出绑定事件----------------------------------------*/

        poker.$play_event.eq(1).on('click','.play',function(){
         
            clearInterval(clearTime4);

            clearInterval(clearTime5);

            that.play(poker);



        }).on('click','.no_play',function(){
         
            clearInterval(clearTime4);

            clearInterval(clearTime5);

            that.noPlay();
            
        });


        /*---------player2出牌不出绑定事件----------------------------------------*/

        poker.$play_event.eq(2).on('click','.play',function(){

            clearInterval(clearTime4);

            clearInterval(clearTime5);
           
            that.play(poker);



        }).on('click','.no_play',function(){
 
            clearInterval(clearTime4);

            clearInterval(clearTime5);

            that.noPlay();

        });


        /*---------出牌不出绑定事件结束--------------------------------------------*/

        /*---------扑克牌单张点击事件开始------------------------------------------*/

        /*---------player1扑克牌点击事件--------------------------------*/
        poker.$play1_poker.on('click', 'li', function(){
            if(that.flag.over_land_grab&&that.flag.player ==0){
                var left = $(this).css('left');
                if(left != '10px'){                            //如果没有往上移,点击则往上移
                    $(this).css({left:'10px'});
                    ready_poker.poker.push($(this).attr('data-value'));
                    that.sort_showPoker(ready_poker.poker);
                    console.log(ready_poker.poker);
                }else{                                  //如果往上移了，则点击就下来
                    $(this).css({left:'0px'});
                    var index = ready_poker.poker.indexOf($(this).attr('data-value'));
                    ready_poker.poker.splice(index, 1);
                    console.log(ready_poker.poker);
                }
            }
        });

        /*---------player2扑克牌点击事件--------------------------------*/
        poker.$play2_poker.on('click', 'li', function(){
            if(that.flag.over_land_grab&&that.flag.player ==1){
                var top = $(this).css('top');
                if(top != '-10px'){                            //如果没有往上移,点击则往上移
                    $(this).css({top:'-10px'});
                    ready_poker.poker.push($(this).attr('data-value'));
                    that.sort_showPoker(ready_poker.poker);
                    console.log(ready_poker.poker);
                }else{                                  //如果往上移了，则点击就下来
                    $(this).css({top:'0px'});
                    var index = ready_poker.poker.indexOf($(this).attr('data-value'));
                    ready_poker.poker.splice(index, 1);
                    console.log(ready_poker.poker);
                }
            }
        });

        /*---------player3扑克牌点击事件--------------------------------*/

        poker.$play3_poker.on('click', 'li', function() {
            if (that.flag.over_land_grab && that.flag.player == 2) {
                var left = $(this).css('left');
                if (left != '-10px') {                            //如果没有往上移,点击则往上移
                    $(this).css({left: '-10px'});
                    ready_poker.poker.push($(this).attr('data-value'));
                    that.sort_showPoker(ready_poker.poker);
                    console.log(ready_poker.poker);
                } else {                                  //如果往上移了，则点击就下来
                    $(this).css({left: '0px'});
                    var index = ready_poker.poker.indexOf($(this).attr('data-value'));
                    ready_poker.poker.splice(index, 1);
                    console.log(ready_poker.poker);
                }
            }
        });


        /*---------扑克牌单张点击事件开始------------------------------------------*/

        //play2提示功能
        poker.$play_event.eq(1).on('click','.hint',function(){
            console.log(1)
            that.playerHint('top','-10px',poker);
        });

        //play1提示功能
        poker.$play_event.eq(0).on('click','.hint',function(){
            console.log(0)
            that.playerHint('left','10px',poker);
        });

        //play3提示功能
        poker.$play_event.eq(2).on('click','.hint',function(){
            console.log(2)
            that.playerHint('left','-10px',poker);
        });

        poker.$bottom.mousedown(function (e) {

            that.dragDown(e,poker);
        });

        poker.$bottom.mouseup(function(e){
            that.dragUp(e);
        });


        poker.$over.on('click','#continue',function(){

            that.playAgain(poker);

            $('.over').removeClass('over_1');
            $('.over_2').removeClass('conceal');
            $('.over_3').removeClass('count');


        });




    },

    /*--------背面牌向上函数----------------------*/

    pokerUp:function(){

        for(var i=0;i<54;i++){

            poker.$back.eq(i).animate({top:''+-i+''},300);

        }

    },

    /*--------洗牌函数----------------------------*/

    clearPoker:function(){

        var all_poker = poker.$mid_top.html();

        poker.$all_poker.remove();

        //生成三堆牌用于洗牌动画
        for(i=0;i<3;i++){

            var $ul=$('<ul />').attr('class', 'all_poker').css({top:-i*150+'px'});

            for(var j=0;j<18;j++){

                var $li=$('<li />').attr('class', 'back').css({top:-j+'px'});

                $ul.append($li);

            }

            poker.$mid_top.append($ul);

        }

        poker.$all_poker = $('.all_poker');

        //洗牌动画

        for(var j=0;j<3;j++){

            poker.$all_poker.eq(0).animate({left:'-300px'},300).animate({left:'0px'},300);

            poker.$all_poker.eq(1).animate({left:'300px'},300).animate({left:'0px'},300);

        }

        setTimeout(function(){

            poker.$mid_top.html(all_poker);

            poker.$all_poker = $('.all_poker');

            poker.$back = $('.back');

            poker.$all_poker_li = $('.all_poker li');

        },1800);

    },

    /*--------生成玩家牌堆数据----------------------------*/

    createPlayerPokerData:function(){

        for(var i=0;i<3;i++){

            this.poker_arr.sort(function(x,y){return Math.random()-0.5;});       //随机打乱牌的数据

        }

        //生成玩家牌组

        for(var i=0;i<17;i++){

            this.all_player[0].poker.push(this.poker_arr[53-(i*3)]);

            this.all_player[1].poker.push(this.poker_arr[53-(i*3)-1]);

            this.all_player[2].poker.push(this.poker_arr[53-(i*3)-2]);

        }


        // 三张地主牌的数据
        for(var i=0;i<3;i++){

            this.landlord_poker[i] = this.poker_arr[i];

        }

    },

    /*--------发牌函数----------------------------*/

    deal:function(number,num){

        var that=this;

        //给左边玩家发牌
        
        poker.$all_poker_li.eq(poker.$all_poker_li.length-1-number).animate({left:'-650px',top:'200px'},120,function(){     //最后一张的动画

            poker.$all_poker_li.eq(poker.$all_poker_li.length-1-number).remove();//移除最后一张牌

            //添加li
            
            if(screen>1386) {

                var poker_html = '<li style="width: 100px; height: 150px; border-radius: 6px">' + that.ssPoker(that.all_player[0].poker[num]) + '<a href="javascript:;" class="list flip " style="background:url(4.jpg) no-repeat; background-size:100px 150px; border-radius: 6px;"></a></li>';

            }else{

                var poker_html = '<li style="width: 100px; height: 150px; border-radius: 6px">' + that.ssPoker(that.all_player[0].poker[num]) + '<a href="javascript:;" class="list flip " style="background:url(4.jpg) no-repeat; background-size:80px 120px; border-radius: 6px;"></a></li>';

            }

            //玩家一的位置
            
            poker.$play1_poker.append(poker_html).css({top:-9*num+144+'px'});

            //动态添加后要重新获取玩家一里面的li
            
            poker.$play1_poker_li = $('.player1_poker li');

            //给玩家一里面的li添加位移
            
            if(screen>1386) {

                poker.$play1_poker_li.eq(poker.$play1_poker_li.length - 1).css({top: num * 24 + 'px'});

            }else{

                poker.$play1_poker_li.eq(poker.$play1_poker_li.length - 1).css({top: num * 19 + 'px'});

            }



            //给中间玩家发牌
            
            poker.$all_poker_li.eq(poker.$all_poker_li.length-2-number).animate({top:'450px'},120,function(){

                poker.$all_poker_li.eq(poker.$all_poker_li.length-2-number).remove();

                var poker_html = that.showPoker(that.all_player[1].poker[num]);

                poker.$play2_poker.append(poker_html).css({left:-9*num+404+'px'});

                poker.$play2_poker_li = $('.player2_poker li');

                if(screen>1386) {

                    poker.$play2_poker_li.eq(poker.$play2_poker_li.length - 1).css({left: num * 24 + 'px'});

                }else{

                    poker.$play2_poker_li.eq(poker.$play2_poker_li.length - 1).css({left: num * 19 + 'px'});

                }




                //给右边玩家发牌
                
                poker.$all_poker_li.eq(poker.$all_poker_li.length-3-number).animate({left:'650px',top:'200px'},120,function(){

                    poker.$all_poker_li.eq(poker.$all_poker_li.length-3-number).remove();

                    if(screen>1386) {

                        var poker_html = '<li style="width: 100px; height: 150px; border-radius: 6px">' + that.ssPoker(that.all_player[2].poker[num]) + '<a href="javascript:;" class="list flip " style="background:url(4.jpg) no-repeat; background-size:100px 150px; border-radius: 6px;"></a></li>';

                    }else{

                        var poker_html = '<li style="width: 100px; height: 150px; border-radius: 6px">' + that.ssPoker(that.all_player[2].poker[num]) + '<a href="javascript:;" class="list flip " style="background:url(4.jpg) no-repeat; background-size:80px 120px; border-radius: 6px;"></a></li>';

                    }

                    poker.$play3_poker.append(poker_html).css({top:-9*num+144+'px'});

                    poker.$play3_poker_li = $('.player3_poker li');

                    if(screen>1386){

                        poker.$play3_poker_li.eq(poker.$play3_poker_li.length-1).css({top:num*24+'px'});

                    }else{

                        poker.$play3_poker_li.eq(poker.$play3_poker_li.length-1).css({top:num*19+'px'});

                    }


                    number=number+3;

                    num++;

                    if(number<50){

                        that.deal(number,num);

                    }else{

                        //删除原来的li，并且加入收缩动画
                        
                        poker.$play2_poker_li.animate({left:'0px'},1000,function(){

                            poker.$play2_poker_li.remove();

                            that.sort_showPoker(that.all_player[1].poker);//执行排序事件

                            //开始动画
                            
                            for(var i=0;i<that.all_player[1].poker.length;i++){

                                var poker_html = that.showPoker(that.all_player[1].poker[i]);

                                poker.$play2_poker.append(poker_html).css({left:'0px'});

                                poker.$play2_poker_li = $('.player2_poker li');

                                poker.$play2_poker_li.eq(0).css({left:'0px'});

                            }

                            poker.$play2_poker.css({left:'261px'});
                        
                            for(var i=0;i<that.all_player[1].poker.length;i++){

                                poker.$play2_poker_li.eq(i).animate({left:24*i+'px'},1000);

                            }

                            //that.mp(poker);

                        });

                        if(screen>1386){

                            poker.$all_poker_li.eq(0).animate({top:'-315px'},500).animate({left:'-180px'},500);

                            poker.$all_poker_li.eq(2).animate({top:'-315px'},500).animate({left:'180px'},500);

                            poker.$all_poker_li.eq(1).animate({top:'-315px'},500);

                        }else{

                            poker.$all_poker_li.eq(0).animate({top:'-202px'},500).animate({left:'-142px'},500);

                            poker.$all_poker_li.eq(2).animate({top:'-202px'},500).animate({left:'218px'},500);

                            poker.$all_poker_li.eq(1).animate({top:'-202px'},500).animate({left:'38px'},500);

                        }

                        var poker_html = $('.all_poker li');

                        poker.$mingpai.show();

                        var landlord = Math.floor(Math.random()*3);

                        that.landload_flag.current_player = landlord;

                        //调用抢地主函数
                        // that.land_grab(landlord,0,call.a,call.b,call.c,flag,poker);
                        
                        poker.$button_container.eq(landlord).show();
                        clearTime1 = setInterval(function(){
                            var time = $('.call_clock').eq(landlord).attr('value');
                            $('.call_clock').eq(landlord).attr('value',time-1);
                            if(time==0){
                                $('.not_call').eq(landlord).trigger("click");
                            }
                        },1000);

                    }

                });

            });

        }); 
    },

    ssPoker:function(pokerface){

        if(screen>1386){

            return '<a href="javascript:;" class="list flip out" style="background: url(img/'+pokerface+'.jpg) no-repeat; background-size:100px 150px; border-radius: 6px;" data-value="'+pokerface+'"></a>'

        }else{

            return '<a href="javascript:;" class="list flip out" style="background: url(img/'+pokerface+'.jpg) no-repeat; background-size:80px 120px; border-radius: 6px;" data-value="'+pokerface+'"></a>'

        }

    },

    /*-----------加载牌面的数据------------------------------------------*/

    showPoker:function(pokerface){

        if(screen>1386){

            return '<li style="width: 100px; height: 150px; background: url(img/'+ pokerface+'.jpg) no-repeat; background-size:100px 150px; border-radius: 6px;" data-value="'+pokerface+'"><div class="frame"></div></li>';

        }else{

            return '<li style="width: 80px; height: 120px; background: url(img/'+ pokerface+'.jpg) no-repeat; background-size:80px 120px; border-radius: 6px;" data-value="'+pokerface+'"><div class="frame" style="width:80px; height:120px"></div></li>';

        }

    },

    /*-----------对玩家的牌的数据进行排序------------------------------------------*/

    sort_showPoker:function(play_p){

        //获取点数的值
        //
        console.log(play_p);
        
        function getCount(count){

            var index = count.indexOf('_');         //以—分界拿到扑克点数

            var x = count.substr(0, index);         //截取扑克的点数

            return x;

        }

        //获取花色
        
        function getFace(face){

            var index = face.indexOf('_');          //截取扑克的花色

            var x = face.substring(index+1, index+2);

            return x;

        }

        //进行排序
        
        play_p.sort(function(x,y){                  //用sort（）方法排序

            var count1 = getCount(x);

            var count2 = getCount(y);

            if(count1==count2){                     //如果点数一样

                var count3= getFace(x);

                var count4 = getFace(y);

                return count4-count3;               //排序花色

            }else{

                return count2-count1;               //否则排序点数

            }

        });

    },


    /*-----------名牌的特效------------------------------------------*/

    autoclick:function(play,n){
        var that=this;
                if(n<17){

                   play.eq(n).trigger("click");

                    n++;

                    setTimeout( that.autoclick(n), 30 );

                } return

            },
    play1_left:function(){
        var that=this;

        poker.$play1_poker_li.remove();

        for(var i=0;i<17;i++){

            var poker_html = that.showPoker(that.all_player[0].poker[i]);

            poker.$play1_poker.append(poker_html).css({top:-9*i+144+'px'});     //玩家1增加扑克

            poker.$play1_poker_li = $('.player1_poker li');

            if(screen>1386){

                poker.$play1_poker_li.eq(poker.$play1_poker_li.length - 1).css({top:i*24+'px'});

            }else{

                poker.$play1_poker_li.eq(poker.$play1_poker_li.length - 1).css({top:i*19+'px'});

            }

        }

    },
    play3_right:function(){
        var that=this;

        poker.$play3_poker_li.remove();

        for(var i=0;i<17;i++){

            var poker_html = that.showPoker(that.all_player[2].poker[i]);

            poker.$play3_poker.append(poker_html).css({top:-9*i+144+'px'});

            poker.$play3_poker_li = $('.player3_poker li');

            if(screen>1386){

                poker.$play3_poker_li.eq(poker.$play3_poker_li.length-1).css({top:i*24+'px'});

            }else{

                poker.$play3_poker_li.eq(poker.$play3_poker_li.length-1).css({top:i*19+'px'});

            }

        }

    },
    fanzhuan:function (play_1,list){

            var eleBack = null, eleFront = null,

                // 纸牌元素们
                
                eleList = list;

            // 确定前面与后面元素
            
            var funBackOrFront = function() {

                eleList.each(function() {

                    if ($(this).hasClass("out")) {

                        eleBack = $(this);

                    } else {

                        eleFront = $(this);

                    }

                });

            };
            funBackOrFront();

            play_1.bind("click", function() {
                // 切换的顺序如下
                // 1. 当前在前显示的元素翻转90度隐藏, 动画时间225毫秒
                // 2. 结束后，之前显示在后面的元素逆向90度翻转显示在前
                // 3. 完成翻面效果

                eleFront.addClass("out").removeClass("in");

                setTimeout(function() {

                    eleBack.addClass("in").removeClass("out");

                    // 重新确定正反元素
                    
                    funBackOrFront();

                }, 225);

                return false;

            });

        },
    

    /*------判断谁是地主函数----------------------------------------------------*/

    judgeLandload:function(poker){

        if(this.landload_flag.all>0){

            poker.$land_grab.val('抢地主');

            poker.$not_call.val('不抢');

        }

        if(this.landload_flag.player0==2){

            poker.$left_name.html('<img src="1.jpg" style="width:70px;height:70px; border-radius: 10px;">');

            poker.$bottom_name.html('<img src="2.jpg" style="width:70px;height:70px; border-radius: 10px;">');

            poker.$right_name.html('<img src="3.jpg" style="width:70px;height:70px; border-radius: 10px;">');

            this.flag.boss = 0;

            this.flag.player = 0;

            this.all_player[0].multiple=this.all_player[0].multiple*2;

            poker.$mom.eq(0).attr('value',this.all_player[0].multiple);

            this.giveLandGrab(poker);
            
             this.flag.flg = 1;

        }else if(this.landload_flag.player1==2){

            poker.$bottom_name.html('<img src="1.jpg" style="width:70px;height:70px; border-radius: 10px;">');

            poker.$left_name.html('<img src="2.jpg" style="width:70px;height:70px; border-radius: 10px;">');

            poker.$right_name.html('<img src="3.jpg" style="width:70px;height:70px; border-radius: 10px;">');

            this.flag.boss = 1;

            temporary_flag.player = 1;

            this.flag.player = 1;

            this.all_player[1].multiple=this.all_player[1].multiple*2;

            poker.$mom.eq(1).attr('value',this.all_player[1].multiple);

            this.giveLandGrab(poker);
            
            this.flag.flg = 1;

        }else if(this.landload_flag.player2==2){

            poker.$right_name.html('<img src="1.jpg" style="width:70px;height:70px; border-radius: 10px;">');

            poker.$bottom_name.html('<img src="2.jpg" style="width:70px;height:70px; border-radius: 10px;">');

            poker.$left_name.html('<img src="3.jpg" style="width:70px;height:70px; border-radius: 10px;">');

            this.flag.boss = 2;

            temporary_flag.player = 2;

            this.flag.player = 2;

            this.all_player[2].multiple=this.all_player[2].multiple*2;

            poker.$mom.eq(2).attr('value',this.all_player[2].multiple);

            this.giveLandGrab(poker);
            
            this.flag.flg = 1;

        }else if(this.landload_flag.player0==1&&this.landload_flag.player1==-1&&this.landload_flag.player2==-1){

            poker.$left_name.html('<img src="1.jpg" style="width:70px;height:70px; border-radius: 10px;">');

            poker.$bottom_name.html('<img src="2.jpg" style="width:70px;height:70px; border-radius: 10px;">');

            poker.$right_name.html('<img src="3.jpg" style="width:70px;height:70px; border-radius: 10px;">');

            this.flag.boss = 0;

            temporary_flag.player = 0;

            this.flag.player = 0;

            this.all_player[0].multiple=this.all_player[0].multiple*2;

            poker.$mom.eq(0).attr('value',this.all_player[0].multiple);

            this.giveLandGrab(poker);
            
            this.flag.flg = 1;
            

        }else if(this.landload_flag.player0==-1&&this.landload_flag.player1==1&&this.landload_flag.player2==-1){

            poker.$bottom_name.html('<img src="1.jpg" style="width:70px;height:70px; border-radius: 10px;">');

            poker.$left_name.html('<img src="2.jpg" style="width:70px;height:70px; border-radius: 10px;">');

            poker.$right_name.html('<img src="3.jpg" style="width:70px;height:70px; border-radius: 10px;">');

            this.flag.boss = 1;

            temporary_flag.player = 1;

            this.flag.player = 1;

            this.all_player[1].multiple=this.all_player[1].multiple*2;

            poker.$mom.eq(1).attr('value',this.all_player[1].multiple);

            this.giveLandGrab(poker);
            
            this.flag.flg = 1;


        }else if(this.landload_flag.player0==-1&&this.landload_flag.player1==-1&&this.landload_flag.player2==1){

            poker.$right_name.html('<img src="1.jpg" style="width:70px;height:70px; border-radius: 10px;">');

            poker.$bottom_name.html('<img src="2.jpg" style="width:70px;height:70px; border-radius: 10px;">');

            poker.$left_name.html('<img src="3.jpg" style="width:70px;height:70px; border-radius: 10px:7');

            this.flag.boss = 2;

            temporary_flag.player = 2;

            this.flag.player = 2;

            this.all_player[2].multiple=this.all_player[2].multiple*2;

            poker.$mom.eq(2).attr('value',this.all_player[2].multiple);

            this.giveLandGrab(poker);

            this.flag.flg = 1;

        }else if(this.landload_flag.player0==-1&&this.landload_flag.player1==-1&&this.landload_flag.player2==-1){

            alert('重新发牌');

            this.playAgain(poker);

        }

    },


    /*-----给地主牌函数-----------------------------------------*/

    giveLandGrab:function (poker) {
        clearInterval(clearTime1);


        var that = this;

        that.therr(poker);

        $('.button_container').hide();

        for(var i=0;i<3;i++){

            that.all_player[that.flag.boss].poker.push(that.landlord_poker[i]);

        }

        console.log(that.all_player[that.flag.boss].poker);

        that.sort_showPoker(that.all_player[that.flag.boss].poker);

        that.flag.over_land_grab = true;

        that.refresh_poker('.player'+(that.flag.boss+1)+'_poker',that.all_player[that.flag.boss].poker);

        poker.$play_event.eq(that.flag.boss).show();
       

         clearTime4 = setInterval(function(){

            $('.play_clock').eq(that.flag.boss).attr('value',xunhantt);

            xunhantt--;

            if(xunhantt==0){

                clearInterval(clearTime4);

                if(that.flag.boss == 0){

                    that.playerHint('left','10px',poker);

                }else if(that.flag.boss == 1){

                    that.playerHint('top','-10px',poker);

                }else{

                    that.playerHint('left','-10px',poker);

                }

                

                $('.play').eq(that.flag.boss).trigger("click");

                xunhantt=30;

            }

        },1000);

    },

    therr:function(){
      poker.$ado.attr('src','./audio/loves me not.mp3');

        var that=this;//抢完地主之后三张地主牌出现

        //$('#ado').attr('src','./audio/loves me not.mp3');
        
        setTimeout(function () {

            poker.$all_poker_li.remove();

            for(var j=0;j<3;j++){

                poker.$three_poker.append(that.showPoker(that.landlord_poker[j]));

                poker.$three_poker_li=$('.three_poker li');

            }

            poker.$three_poker_li.eq(0).css({left:'19px'});

            poker.$three_poker_li.eq(1).css({left:'198px'});

            poker.$three_poker_li.eq(2).css({left:'379px'});

        },500);

    },

    /*------重置玩家牌的数据----------------------------------------*/

    refresh_poker:function (player,play_poker) {

        $(player+' li').remove();

        for(var i=0;i<play_poker.length;i++){     //重新添加牌

            var poker_html = this.showPoker(play_poker[i]);

            if(this.flag.player==1){                   //玩家为2的时候

                $(player).append(poker_html).css({left:-9*i+404+'px'});

                if(screen>1386){

                    $(player+' li:last').css({left:i*24+'px'});

                }else{

                    $(player+' li:last').css({left:i*19+'px'});

                }

            }else{                               //玩家为1跟3的时候

                $(player).append(poker_html).css({top:-9*i+144+'px'});

                if(screen>1386){

                    $(player+' li:last').css({top:i*24+'px'});

                }else{

                    $(player+' li:last').css({top:i*19+'px'});

                }

            }

        }

        poker.$play3_poker_li = $('.player3_poker li');

        poker.$play2_poker_li = $('.player2_poker li');

        poker.$play1_poker_li = $('.player1_poker li');

    },

    /*--------出牌函数------------------------------------------*/
    play:function (poker) {

        var that = this;

        new_that = that;

        temporary_flag.player = that.flag.player;

        clearInterval(clearTime5);
     
        xunhantt=30;

        if(!that.checkPoker(ready_poker.poker)){

            clearTime5 = setInterval(that.showClock,1000);

            poker.$a1.addClass('alert').html('你不是小学二年级！');

            setTimeout(function(){

                poker.$a1.addClass('a2');

                poker.$a1.removeClass('alert');

                setTimeout(function(){

                    poker.$a1.removeClass('a2').html('');

                },1000)

            },1500)

            return false;

        }else if(!this.pokerVs()){

            clearTime5 = setInterval(that.showClock,1000);

            poker.$a1.addClass('alert').html('你的智商没有人家高！');

            setTimeout(function(){

                poker.$a1.addClass('a2');

                poker.$a1.removeClass('alert');

                setTimeout(function(){

                    poker.$a1.removeClass('a2').html('');

                },1000)

            },1500)

            return false;

        }

        if(ready_poker.type==66){

            $('.bbj').addClass('bjj');
            
            $('.bjj').html('顺子');
            
            setTimeout(function(){
            
             $('.bbj').removeClass('bjj');
            
             $('.bbj').html('');
            
            },5000)
            
            $('.sz img').animate({'marginLeft':'-100%'},8000,function(){
            
             $('.sz img').css('marginLeft','100%')
            
            })
            
        }else if(ready_poker.type==33){

            /*alert('飞机')*/

        }else if(ready_poker.type==999){

            $('.yh').removeClass('yinghua');
            
            $('#ado')[0].pause();
            
            that.showmultiple();

            $('.booo').addClass('boom');
            
            $('.bbj').addClass('bjj');
            
            $('.bbj').html('炸弹');
            
            $('#boom')[0].play();
            
            $('body').addClass('main');
            
            $('.right').addClass('right_1');
            
            $('.score').addClass('score_1');
            
            setTimeout(function(){
            
             $('.booo').removeClass('boom');
            
             $('.bbj').removeClass('bjj');
            
             $('.bbj').html('');
            
             $('#boom')[0].pause();
            
             $('#ado')[0].play();
            
             $('body').removeClass('main');
            
             $('.right').removeClass('right_1');
            
             $('.score').removeClass('score_1');
            
             $('.yh').addClass('yinghua');
            
            },1500)

        }else if(ready_poker.type==110){

            that.showmultiple();

            $('.bos').addClass('boss');
            
            $('.bbj').addClass('bjj');
            
            $('.bjj').html('王炸');
            
            $('.yh').removeClass('yinghua');
            
            setTimeout(function(){
            
             $('.bos').removeClass('boss');
            
             $('.bbj').removeClass('bjj');
            
             $('.bbj').html('');
            
             $('.yh').addClass('yinghua');
            
            },10000)
            
        }

        //----剩三张判断-------------------------------



        //----剩三张判断-------------------------------

        desktop_poker.type = ready_poker.type;

        desktop_poker.max = ready_poker.max;

        desktop_poker.poker = [];

        for(var i=0;i<ready_poker.poker.length;i++){

            desktop_poker.poker.push(ready_poker.poker[i]);

            for(var j=0;j<that.all_player[that.flag.player].poker.length;j++){

                if(ready_poker.poker[i]==that.all_player[that.flag.player].poker[j]){

                    $('.player'+(that.flag.player+1)+'_poker'+' li').eq(j).remove();

                    that.all_player[that.flag.player].poker.splice(j,1);

                }

                that.refresh_poker('.player'+(that.flag.player+1)+'_poker',that.all_player[that.flag.player].poker);

            }

        }

        //调用检查牌的类型的方法
        
        console.log('类型：'+ready_poker.type+',最大值：'+ready_poker.max);

        //调用出牌方法
        that.showCard('.all_poker',ready_poker.poker);

        //判断玩家手牌是否剩3张
        if(that.all_player[that.flag.player].alarm_flag==0){

            if(that.all_player[that.flag.player].poker.length<=3){

                $('.alarm').eq(that.flag.player).show();

                if(that.flag.alarm_music_flag== true){

                    $('#ado').attr('src','./audio/02.mp3');

                    that.flag.alarm_music_flag = false;

                }

                
                that.all_player[that.flag.player].alarm_flag=1;

            }

        }

        //判断是否是赢了
        
        if(that.all_player[that.flag.player].poker.length == 0){

//-----------积分加减开始----------------------------------------------------------------------------
            if(that.flag.player==that.flag.boss){

                //地主赢了
                
                $('.result').attr('value','地主胜');

                for(var i=0;i<3;i++){

                    if(i==that.flag.boss){

                        $('.add').eq(i).html(Number($('.mom').eq(that.flag.player).attr('value')));

                        that.all_player[i].integral=that.all_player[i].integral+Number($('.mom').eq(that.flag.player).attr('value'));

                    }else{

                        $('.add').eq(i).html(-Number($('.mom').eq(that.flag.player).attr('value'))/2);

                        that.all_player[i].integral=that.all_player[i].integral-Number($('.mom').eq(that.flag.player).attr('value')/2);

                    }

                }

                //地主输了
                
            }else{

                $('.result').attr('value','农民胜');

                for(var i=0;i<3;i++){

                    if(i==that.flag.boss){

                        $('.add').eq(i).html(-Number($('.mom').eq(that.flag.player).attr('value')));

                        that.all_player[i].integral=that.all_player[i].integral-Number($('.mom').eq(that.flag.player).attr('value'));

                    }else{

                        $('.add').eq(i).html(Number($('.mom').eq(that.flag.player).attr('value'))/2);

                        that.all_player[i].integral=that.all_player[i].integral+Number($('.mom').eq(that.flag.player).attr('value')/2);

                    }

                }

            }
//-----------积分加减结束---------------------------------------------------------------------------

////______判断是否已特殊的牌型结尾____________________________________________________

            if(ready_poker.type==66){

                setTimeout(function(){

                    $('.over').addClass('over_1');

                    $('.over_2').addClass('conceal');

                    $('.over_3').addClass('count');

                },5000)

            }else if(ready_poker.type==999){

                setTimeout(function(){

                    $('.over').addClass('over_1');

                    $('.over_2').addClass('conceal');

                    $('.over_3').addClass('count');

                },1500)

            }else if(ready_poker.type==999){

                setTimeout(function(){

                    $('.over').addClass('over_1');

                    $('.over_2').addClass('conceal');

                    $('.over_3').addClass('count');

                },10000)

            }else{

                $('.over').addClass('over_1');

                $('.over_2').addClass('conceal');

                $('.over_3').addClass('count');

            }


////______判断是否已特殊的牌型结尾____________________________________________________
            return false;

        }

        poker.$play_event.eq(that.flag.player).hide();

        clearInterval(clearTime5);

        if(that.flag.player==2){

            that.flag.player=0;

        }else{

            that.flag.player++;

        }

        temporary_flag.player = that.flag.player;

        clearInterval(clearTime5);

        poker.$play_event.eq(that.flag.player).show();


        $('.play_clock').eq(that.flag.player).attr('value',"30");

        //计时器执行
        
        clearTime5 = setInterval(that.showClock,1000);

        ready_poker = {poker:[], type:0, max:0};

        that.flag.cancle = 0;

    },

    /*------绑定不出事件----------------------------------------*/
    noPlay:function (){
        var that=this;
        clearInterval(clearTime5); 
        xunhantt=30;
        clearInterval(clearTime4);
        if(desktop_poker.type == 0){
            clearTime5 = setInterval(that.showClock,1000);
            $('.a1').addClass('alert').html('你必须要出一张！');
            setTimeout(function(){
                $('.a1').addClass('a2');
                $('.a1').removeClass('alert');
                setTimeout(function(){
                    $('.a1').removeClass('a2').html('');
                },1000)
            },1500)
            return false;
        }else{
            that.flag.cancle += 1;
            if(that.flag.cancle == 2){
                desktop_poker = {type:0, max:0, poker:[]};
            }
        }
        that.refresh_poker('.player'+(that.flag.player+1)+'_poker',that.all_player[that.flag.player].poker);
        ready_poker = {poker:[], type:0, max:0};
        $('.play_event').eq(that.flag.player).hide();
      
        if(that.flag.player==2){
            that.flag.player=0;
        }else{
            that.flag.player++;
        }

        temporary_flag.player = that.flag.player;
        temporary_flag.cancle = that.flag.cancle;


        $('.play_event').eq(that.flag.player).show();
        $('.play_clock').eq(that.flag.player).attr('value',"30");
        //--------------------------------------------------------------
        //计时器执行
        clearInterval(clearTime5); 
        clearTime5 = setInterval(that.showClock,1000);
        ready_poker = {poker:[], type:0, max:0};
    },

    /*---提示函数--------------------------------------------------*/

    playerHint:function (move,move_length,poker) {

        var that = this;

        console.log(that);

        //判断当前game_status.player值，获取当前需要提示的玩家
        
        if(this.hintPoker(temporary_flag.player)){                //调用提示函数

            this.sort_showPoker(ready_poker.poker); //每一次都对数组进行排序，防止冲突

            for(var i=0;i<this.all_player[this.flag.player].poker.length;i++){       //循环匹配牌的数据，匹配到就让他提起

                for(var j=0;j<ready_poker.poker.length;j++){

                    if($('.player'+(this.flag.player+1)+'_poker'+' li').eq(i).attr('data-value')==ready_poker.poker[j])

                        $('.player'+(this.flag.player+1)+'_poker'+' li').eq(i).css(move,move_length);

                }

            }

            return true;

        }else if(this.findBomb(this.flag.player)){

            this.sort_showPoker(ready_poker.poker);    //每一次都对数组进行排序，防止冲突

            for(var i=0;i<this.all_player[this.flag.player].poker.length;i++){       //循环匹配牌的数据，匹配到就让他提起

                for(var j=0;j<ready_poker.poker.length;j++){

                    if($('.player'+(this.flag.player+1)+'_poker'+' li').eq(i).attr('data-value')==ready_poker.poker[j])

                        $('.player'+(this.flag.player+1)+'_poker'+' li').eq(i).css(move,move_length);

                }

            }

            return true;

        }else{

            poker.$a1.addClass('alert').html('你的智商没有人家高！');

            poker.$no_play.eq(this.flag.player).trigger("click");

            setTimeout(function(){

                poker.$a1.addClass('a2');

                poker.$a1.removeClass('alert');

                setTimeout(function(){

                    poker.$a1.removeClass('a2').html('');

                },900);

            },1500);

            return false;
        }

    },


/*------判断检查牌型---------------------------------------------*/

    checkPoker:function (paly_poker) {

        var length = paly_poker.length;

        var arr = [];//临时数组

        var poker_data = [];

        for(var i=0; i<length; i++){    //找到每张牌的点数

            arr.push(paly_poker[i].split('_'));

            poker_data.push(arr[i][0]);

        }

        //判断牌的类型
        
        switch(length){

            case 1:

                ready_poker.type = 1;

                ready_poker.max = poker_data[0];        // 设置该牌型的判断值

                return true;

                break;

            case 2:

                if(poker_data[0] == poker_data[1]){     //对子

                    ready_poker.type = 2;

                    ready_poker.max = poker_data[0];

                    return true;

                }else if(poker_data[0]==15&&poker_data[1]==14){ //王炸

                    ready_poker.type = 110;

                    ready_poker.max = 110;

                    return true;

                }else{                          //无效牌型

                    ready_poker.type = 0;

                    ready_poker.max = 0;

                    return false;

                }
                break;

            case 3:
                if(poker_data[0] == poker_data[1] && poker_data[1] == poker_data[2]){   //3张
                    ready_poker.type = 3;
                    ready_poker.max = poker_data[0];
                    return true;
                }else{
                    ready_poker.type = 0;           //无效牌型
                    ready_poker.max = 0;
                    return false;
                }
                break;

            case 4:
                if(threeWith(1,poker_data,1,ready_poker)){//3带1
                    ready_poker.type = 31;
                    return true;
                }else if(poker_data[0]==poker_data[3]){//普通炸弹
                    ready_poker.type = 999;
                    ready_poker.max = poker_data[0];
                    return true;
                }else{
                    ready_poker.type = 0;           //无效牌型
                    ready_poker.max = 0;
                    return false;
                }
                break;

            case 5:
                if(threeWith(2,poker_data,1)){//3带2
                    ready_poker.type = 32;
                    return true;
                }else if(straight(poker_data)){//顺子
                    ready_poker.type = 66;
                    ready_poker.max = poker_data[0];
                    return true;
                }else{
                    ready_poker.type = 0;           //无效牌型
                    ready_poker.max = 0;
                    return false;
                }
                break;

            case 6:
                if(allThree(poker_data)){//纯3张相连
                    ready_poker.type = 33;
                    ready_poker.max = poker_data[0];
                    return true;
                }else if(straight(poker_data)){//顺子
                    ready_poker.type = 66;
                    ready_poker.max = poker_data[0];
                    return true;
                }else if(strainghtPair(poker_data)){//连对
                    ready_poker.type = 88;
                    ready_poker.max = poker_data[0];
                    return true;
                }else if(poker_data[0]==poker_data[3]||poker_data[3]==poker_data[5]){//4带2
                    ready_poker.type = 42;
                    ready_poker.max = poker_data[2];
                    return true;
                }else{
                    ready_poker.type = 0;           //无效牌型
                    ready_poker.max = 0;
                    return false;
                }
                break;

            case 7:
                if(straight(poker_data)){
                    ready_poker.type = 66;
                    ready_poker.max = poker_data[0];
                    return true;
                }else{
                    ready_poker.type = 0;           //无效牌型
                    ready_poker.max = 0;
                    return false;
                }
                break;

            case 8:
                if(straight(poker_data)){//顺子
                    ready_poker.type = 66;
                    ready_poker.max = poker_data[0];
                    return true;
                }else if(strainghtPair(poker_data)){//连对
                    ready_poker.type = 88;
                    ready_poker.max = poker_data[0];
                    return true;
                }else if(threeWith(1,poker_data,2)){
                    ready_poker.type = 31;
                    return true;
                }else if(allFour(poker_data)){//纯4张
                    ready_poker.type = 44;
                    ready_poker.max = poker_data[0];
                    return true;
                }else if(poker_data[0]==poker_data[3]&&poker_data[4]==poker_data[5]&&poker_data[6]==poker_data[7]
                    ||poker_data[0]==poker_data[1]&&poker_data[2]==poker_data[5]&&poker_data[6]==poker_data[7]
                    ||poker_data[0]==poker_data[1]&&poker_data[2]==poker_data[3]&&poker_data[4]==poker_data[7]){//4带一对
                    ready_poker.type = 422;
                    ready_poker.max = poker_data[3];
                }else{
                    ready_poker.type = 0;           //无效牌型
                    ready_poker.max = 0;
                    return false;
                }
                break;

            case 9:
                if(straight(poker_data)){//顺子
                    ready_poker.type = 66;
                    ready_poker.max = poker_data[0];
                    return true;
                }else if(allThree(poker_data)){//纯3张
                    ready_poker.type = 33;
                    ready_poker.max = poker_data[2];
                    return true;
                }else{
                    ready_poker.type = 0;           //无效牌型
                    ready_poker.max = 0;
                    return false;
                }
                break;

            case 10:
                if(straight(poker_data)){//顺子
                    ready_poker.type = 66;
                    ready_poker.max = poker_data[0];
                    return true;
                }else if(threeWith(2,poker_data,2)){//3带2
                    ready_poker.type = 32;
                    return true;
                }else if(strainghtPair(poker_data)){//连对
                    ready_poker.type = 88;
                    ready_poker.max = poker_data[0];
                    return true;
                }else{
                    ready_poker.type = 0;           //无效牌型
                    ready_poker.max = 0;
                    return false;
                }
                break;

            case 11:
                if(straight(poker_data)){//顺子
                    ready_poker.type = 66;
                    ready_poker.max = poker_data[0];
                    return true;
                }else{
                    ready_poker.type = 0;           //无效牌型
                    ready_poker.max = 0;
                    return false;
                }
                break;

            case 12:
                if(threeWith(1,poker_data,3)){//3带1
                    ready_poker.type = 31;
                    return true;
                }else if(strainghtPair(poker_data)){//连对
                    ready_poker.type = 88;
                    ready_poker.max = poker_data[0];
                    return true;
                }else if(allThree(poker_data)){//纯3张
                    ready_poker.type = 33;
                    ready_poker.max = poker_data[0];
                    return true;
                }else{
                    ready_poker.type = 0;           //无效牌型
                    ready_poker.max = 0;
                    return false;
                }
                break;

            case 13:
                ready_poker.type = 0;           //无效牌型
                ready_poker.max = 0;
                return false;
                break;

            case 14:
                if(strainghtPair(poker_data)){//连对
                    ready_poker.type = 88;
                    ready_poker.max = poker_data[0];
                    return true;
                }else{
                    ready_poker.type = 0;           //无效牌型
                    ready_poker.max = 0;
                    return false;
                }
                break;

            case 15:
                if(threeWith(2,poker_data,3)){//3带2
                    ready_poker.type = 32;
                    return true;
                }else if(allThree(poker_data)){//纯3张
                    ready_poker.type = 33;
                    ready_poker.max = poker_data[0];
                    return true;
                }else{
                    ready_poker.type = 0;           //无效牌型
                    ready_poker.max = 0;
                    return false;
                }
                break;

            case 16:
                if(strainghtPair(poker_data)){//连对
                    ready_poker.type = 88;
                    ready_poker.max = poker_data[0];
                    return true;
                }else if(threeWith(1,poker_data,4)){//3带1
                    ready_poker.type = 31;
                    return true;
                }else{
                    ready_poker.type = 0;           //无效牌型
                    ready_poker.max = 0;
                    return false;
                }
                break;

            case 17:
                ready_poker.type = 0;           //无效牌型
                ready_poker.max = 0;
                return false;
                break;

            case 18:
                if(strainghtPair(poker_data)){
                    ready_poker.type = 88;
                    ready_poker.max = poker_data[0];
                    return true;
                }else{
                    ready_poker.type = 0;           //无效牌型
                    ready_poker.max = 0;
                    return false;
                }
                break;

            case 19:
                ready_poker.type = 0;           //无效牌型
                ready_poker.max = 0;
                return false;
                break;

            case 20:
                if(strainghtPair(poker_data)){//连对
                    ready_poker.type = 88;
                    ready_poker.max = poker_data[0];
                    return true;
                }else if(threeWith(1,poker_data,5)){//3带1
                    ready_poker.type = 31;
                    return true;
                }else if(threeWith(2,poker_data,4)){//3带2
                    ready_poker.type = 32;
                    return true;
                }else{
                    ready_poker.type = 0;           //无效牌型
                    ready_poker.max = 0;
                    return false;
                }
                break;

        }
        //判断是否为3带1  pokerArr牌,n为3带1还是3带2,num为牌是有几个3带n
        function threeWith(n,pokerArr,num){
            var arr = [];//
            var poker_count = [];//每张牌出现次数
            var three_count = [];//里面有多少3张
            var one_count = 0;//有多少张单张
            var max_location = 0;//初始化最大值得位置
            for(var i=0;i<pokerArr.length;i++){
                if(arr.indexOf(pokerArr[i]) == -1){
                    arr.push(pokerArr[i]);
                    poker_count.push(1);
                }else{
                    var x = arr.indexOf(pokerArr[i]);
                    poker_count[x] += 1;
                }
            }

            //记录单张和3张有多少张
            for(var i=0; i<arr.length; i++){
                if(poker_count[i]==3&&arr[i]-1==arr[i+1]&&poker_count[i+1]==3){//当前为3张且下一个数为本身-1，出现的牌数也是3
                    if(arr[i]>12&&num>1){
                        return false;
                    }else{
                        three_count.push(arr[i]);
                    }

                }
                if(poker_count[i]==n){
                    one_count++;
                }else if(poker_count[i]>n){
                    for(var j=0;j<three_count.length;j++){
                        if(arr[i]==three_count[j]){
                            one_count = one_count+2;
                        }
                    }
                }
            }

            //找最大值得位置
            for(var i=0; i<arr.length; i++){
                if(poker_count[i]==3){
                    break;
                }else{
                    max_location++;
                }
            }
            //把ready_poker
       ready_poker.max = arr[max_location];

            if(three_count==num-1&&one_count==num){
                return true;
            }else{
                return false;
            }

        }

        //顺子函数
        function straight(pokerArr){
            ////判断最大值是否大于2，如果超过2无法相连，长度大于11，则没有顺子
            if(Number(pokerArr[0])>12||pokerArr.length>12){
                return false;
            }else{
                //循环判断该牌组是否是-1不相等，如果有一张则不相等，否则就全部都相等，return true；
                for(var i=0; i<pokerArr.length-1; i++){
                    if(pokerArr[i]-1 != pokerArr[i+1]){
                        return false;
                    }
                }
                return true;
            }

        }

        //纯3张函数
        function allThree(pokerArr,length){
            //判断最大值是否大于2，如果超过2无法相连
            var num = length/3;
            if(Number(pokerArr[0])>12){
                return false;
            }
            else{
                //判断没3张是否是+1相等，且自身同时有3张
                var arr = [];//
                var poker_count = [];//每张牌出现次数
                var three_count = 0;//里面有多少3张
                for(var i=0;i<pokerArr.length;i++){
                    if(arr.indexOf(pokerArr[i]) == -1){
                        arr.push(pokerArr[i]);
                        poker_count.push(1);
                    }else{
                        var x = arr.indexOf(pokerArr[i]);
                        poker_count[x] += 1;
                    }
                }
                //记录单张和3张有多少张
                for(var i=0; i<arr.length; i++){
                    if(poker_count[i]==3&&arr[i]-1==arr[i+1]&&poker_count[i+1]==3){//当前为3张且下一个数为本身-1，出现的牌数也是3
                        three_count++;
                    }

                }
                if(three_count==num-1){
                    return true;
                }else{
                    return false;
                }
            }

        }

        //连对函数
        function strainghtPair(pokerArr){
            //判断最大值是否是2，如果超过2无法相连
            if(Number(pokerArr[0])>12){
                return false;
            }else{
                //判断每2张是否是+1相等，且自身同时自身与=与下一张相等
                for(var i=0; i<pokerArr.length-3; i+=2){
                    if(pokerArr[i] != pokerArr[i+1] || pokerArr[i]-1 != pokerArr[i+3]){
                        return false
                    }
                }
                return true;
            }
        }

        //纯4张函数
        function allFour(pokerArr){
            //判断最大值是否是2，如果超过2无法相连
            if(Number(pokerArr[0])>12){
                return false;
            }else{
                //循环判断是否当前4张为一样的值，并且隔4张相等
                for(var i=0;i<pokerArr.length-5;i+=4);{
                    if(pokerArr[i]!=pokerArr[i+3] || pokerArr[i]+1!=pokerArr[i+4]){
                        return false;
                    }else{
                        return true;
                    }
                }
            }
        }


    },


    /*-----牌比较函数----------------------------------------------*/
    pokerVs:function () {
        // 桌面上没有牌，任间牌型都可以出
        if(desktop_poker.type == 0){
            return true;
        }else if(ready_poker.type==110){    // 出牌的是王炸可以直接出
            return true;
        }else if(desktop_poker.type!=999&&desktop_poker.type!=110&&ready_poker.type==999){      // 桌面的牌不是炸弹跟王炸，那玩家的牌只要是炸就可以出
            return true;
        }else if(desktop_poker.type==ready_poker.type&&ready_poker.poker.length==desktop_poker.poker.length&&Number(ready_poker.max)>Number(desktop_poker.max)){    // 普能牌型大小的判断
            return true;
        }else{
            return false;
        }
    },

    /*----将牌移到出牌区域----------------------------------------*/

    showCard:function (play,play_poker) {
        $(play+' li').remove();
        for(var i=0;i<play_poker.length;i++){
            var poker_html = this.showPoker(play_poker[i]);
            $(play).append(poker_html).css({left:-9*i+'px'});;
            $(play+' li:last').css({left:i*18+'px'});
        }
    },


    /*-----积分翻倍函数--------------------------------------------*/

    showmultiple:function () {
        for(var i=0;i<3;i++){
            this.all_player[i].multiple=this.all_player[i].multiple*2;
        }
        $('.mom').eq(0).attr('value',this.all_player[0].multiple*2);
        $('.mom').eq(1).attr('value',this.all_player[1].multiple*2);
        $('.mom').eq(2).attr('value',this.all_player[2].multiple*2);
    },

    /*-----计时函数-------------------------------------------------*/

    showClock:function () {

        var that = new_that;

        $('.play_clock').eq(temporary_flag.player).attr('value',xunhantt-1);

        xunhantt--;

        if(xunhantt==0){

            xunhantt=30;

            if(temporary_flag.cancle==2){

                if(temporary_flag.player==1){

                    console.log('dasdas');

                    that.playerHint('top','-10px',poker);

                    poker.$play.eq(temporary_flag.player).trigger("click");

                }else if(temporary_flag.player==0){

                    that.playerHint('left','10px',poker);

                    poker.$play.eq(temporary_flag.player).trigger("click");

                }else{

                    that.playerHint('left','-10px',poker);

                    poker.$play.eq(temporary_flag.player).trigger("click");

                }

            }else{

                console.log(temporary_flag.player);

                if(temporary_flag.player==1){

                    if(that.playerHint('top','-10px',poker)){

                        poker.$play.eq(temporary_flag.player).trigger("click");

                    }else{

                        poker.$no_play.eq(temporary_flag.player).trigger("click");

                    }

                }else if(temporary_flag.player==0){

                    if(that.playerHint('left','10px',poker)){

                        poker.$play.eq(temporary_flag.player).trigger("click");

                    }else{

                        poker.$no_play.eq(temporary_flag.player).trigger("click");

                    }

                }else{

                    if(that.playerHint('left','-10px',poker)){

                        poker.$play.eq(temporary_flag.player).trigger("click");

                    }else{

                        poker.$no_play.eq(temporary_flag.player).trigger("click");

                    }

                }

            }

            // clearTime5 = setInterval(that.showClock,1000);

        }


    },

    /*------提示显示牌函数----------------------------------------*/

        hintPoker:function (player) {

        var that = this;
        
        ready_poker = {poker:[], type:0, max:0};        //每一次调用都清空准备出牌数组，防止添加
        var arr = [];           //临时数组
        var player_poker = [];  //用于存玩家手牌的点数
        var count_arr = [];     //出现了什么点数
        var num = [];           //出现点数的次数

        var player = player;

        // console.log(this.all_player[2])

        console.log(this);

        //获取点数
        for(var i=0;i<that.all_player[player].poker.length;i++){
            arr.push(that.all_player[player].poker[i].split('_'));
            player_poker.push(Number(arr[i][0]));
        }

        //去重获取有什么牌和这张牌有多少张
        for(var i=0;i<player_poker.length;i++){
            if(count_arr.indexOf(player_poker[i]) == -1){
                count_arr.push(player_poker[i]);
                num.push(1);
            }else{
                var x = count_arr.indexOf(player_poker[i]);
                num[x] += 1;
            }
        }


        /*      console.log(player_poker);
         console.log(count_arr);
         console.log(num);*/

        //获取点数
        var length = desktop_poker.poker.length;
        console.log('长度:'+desktop_poker.poker.length+',类型:'+desktop_poker.type+',最大值:'+desktop_poker.max);

        switch(length){
            //如果是长度为0时，则提示最后一张牌
            case 0:
                ready_poker.poker.push(that.all_player[player].poker[that.all_player[player].poker.length-1]);
                return true;

            //长度为1
            case 1:
                if(hintSola(player_poker,player)){//是否有单张
                    return true;
                }else{
                    return false;
                }

                break;

            //长度为2
            case 2:
                if(hintPair(player_poker,player)){
                    return true;
                }else{
                    return false;
                }

                break;

            case 3:
                if(hint33or44(arr,player,count_arr,num,length,3)){//找纯3张
                    return true;
                }else{
                    return false;
                }
                break;

            case 4:
                if(desktop_poker.type==31){//判断当前是否是3带1
                    if(hint31(player_poker,player,count_arr,num,length)){
                        return true;
                    }else{
                        return false;
                    }
                }else if(desktop_poker.type==999){//当前是否是普通炸弹
                    if(hintBomb(player_poker,player,count_arr,num,length)){
                        return true;
                    }else{
                        return false;
                    }
                }
            case 5:
                if(desktop_poker.type==66){ //找顺子
                    if(hintStraight(player_poker,player,count_arr,length)){
                        return true;
                    }else{
                        return false;
                    }
                }else if(desktop_poker.type==32){   //找3带2
                    if(hint32(player_poker,player,count_arr,num,length)){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }

                break;

            case 6:
                if(desktop_poker.type==33){     //找纯3张
                    if(hint33or44(player_poker,player,count_arr,num,length,3)){
                        return true;
                    }else{
                        return false;
                    }
                }else if(desktop_poker.type==42){   //找4带2
                    if(hint42(player_poker,player,count_arr,num)){
                        return true;
                    }else{
                        return false;
                    }
                }else if(desktop_poker.type==66){       //找顺子
                    if(hintStraight(player_poker,player,count_arr,length)){
                        return true;
                    }else{
                        return false;
                    }
                }else if(desktop_poker.type==88){       //找连对
                    if(hint88(player_poker,player,count_arr,num,length)){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
                break;

            case 7:
                if(hintStraight(player_poker,player,count_arr,length)){         //找顺子
                    return true;
                }else{
                    return false;
                }
                break;

            case 8:
                if(desktop_poker.type==66){             //找顺子
                    if(hintStraight(player_poker,player,count_arr,length)){
                        return true;
                    }else{
                        return false;
                    }
                }else if(desktop_poker.type==88){       //找连对
                    if(hint88(player_poker,player,count_arr,num,length)){
                        return true;
                    }else{
                        return false;
                    }
                }else if(desktop_poker.type==31){       //找3带1
                    if(hint31(player_poker,player,count_arr,num,length)){
                        return true;
                    }else{
                        return false;
                    }
                }else if(desktop_poker.type==44){       //找纯4张
                    if(hint33or44(player_poker,player,count_arr,num,length,4)){
                        return true;
                    }else{
                        return false;
                    }
                }else if(desktop_poker.type==422){      //找4带2
                    if(hint422(player_poker,player,count_arr,num,length)){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
                break;

            case 9:
                if(desktop_poker.type==66){             //找顺子
                    if(hintStraight(player_poker,player,count_arr,length)){
                        return true;
                    }else{
                        return false;
                    }
                }else if(desktop_poker.type==33){       //找纯3张
                    if(hint33or44(player_poker,player,count_arr,num,length,3)){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
                break;

            case 10:
                if(desktop_poker.type==66){             //找顺子
                    if(hintStraight(player_poker,player,count_arr,length)){
                        return true;
                    }else{
                        return false;
                    }
                }else if(desktop_poker.type==88){       //找连对
                    if(hint88(player_poker,player,count_arr,num,length)){
                        return true;
                    }else{
                        return false;
                    }
                }else if(desktop_poker.type==32){       //找3带2
                    if(hint32(player_poker,player,count_arr,num,length)){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }

            case 11:
                return false;
                break;

            case 12:
                if(desktop_poker.type==88){             //找连对
                    if(hint88(player_poker,player,count_arr,num,length)){
                        return true;
                    }else{
                        return false
                    }
                }else if(desktop_poker.type==33){       //找纯3张
                    if(hint33or44(player_poker,player,count_arr,num,length,3)){
                        return true;
                    }else{
                        return false;
                    }
                }else if(desktop_poker.type==31){       //找3带1
                    if(hint31(player_poker,player,count_arr,num,length)){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
                break;

            case 13:            //没有13张的牌型
                return false;
                break;

            case 14:
                if(desktop_poker.type==88){             //找连对
                    if(hint88(player_poker,player,count_arr,num,length)){
                        return true;
                    }else{
                        return false
                    }
                }else{
                    return false;
                }
                break;

            case 15:
                if(desktop_poker.type==33){             //找纯3张
                    if(hint33or44(player_poker,player,count_arr,num,length,3)){
                        return true;
                    }else{
                        return false;
                    }
                }else if(desktop_poker.type==32){       //找3带2
                    if(hint32(player_poker,player,count_arr,num,length)){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
                break;

            case 16:
                if(desktop_poker.type==32){             //找3带2
                    if(hint32(player_poker,player,count_arr,num,length)){
                        return true;
                    }else{
                        return false;
                    }
                }else if(desktop_poker.type==88){       //找连对
                    if(hint88(player_poker,player,count_arr,num,length)){
                        return true;
                    }else{
                        return false
                    }
                }else{
                    return false;
                }
                break;
            //超过17张后就没有得打，全部return false
            case 17:
                return false;
                break;

            case 18:
                return false;
                break;

            case 19:
                return false;
                break;

            case 20:
                return false;
                break;

        }

        //是否有单张
        function hintSola(arr,player){
            console.log(player);
            for(var i=arr.length-1;i>=0;i--){
                if(arr[i]>desktop_poker.max){
                    ready_poker.poker.push(that.all_player[player].poker[i]);
                    return true;
                }
            }
            return false;
        }

        //是否有对子
        function hintPair(arr,player){
            for(var i=arr.length-1;i>=0;i--){
                if(arr[i]>desktop_poker.max&&arr[i]==arr[i+1]){
                    ready_poker.poker.push(that.all_player[player].poker[i]);
                    ready_poker.poker.push(that.all_player[player].poker[i+1]);
                    return true;
                }
            }
            return false;
        }

        //提示顺子
        function hintStraight(arr,player,count_arr,length){//当前玩家手牌,当前玩家,出的牌的长度,点数数组,次数数组,长度
            //如果最大值为A，则直接退出，否则进行判断
            //
            var new_arr = [];//临时数组
            if(desktop_poker.max>12){
                return false;
            }else{
                //找顺子
                for(var i=count_arr.length-1;i>=0;i--){
                    if(count_arr[i]>desktop_poker.max){
                        new_arr.push(count_arr[i]);
                        for(var j=0;j<length-1;j++){
                            //循环判断-1是否等于下一张，如果找到相应长度则跳出
                            if(count_arr[i+j]-1==count_arr[i+j+1]){
                                new_arr.push(count_arr[i+j+1]);
                            }
                        }
                    }

                    //如果找到相应长度的数组就跳出循环
                    if(new_arr.length==length){
                        break;
                    }else{
                        new_arr=[];
                    }
                }

                //判断是否长度是否为0，并且第一是否大于A，大于A就不能获取提示
                if(new_arr.length==0||new_arr[0]>12){
                    return false;
                }else{
                    //去当前玩家的数组去找对应的牌
                    for(var i=arr.length-1;i>=0;i--){
                        for(var j=new_arr.length-1;j>=0;j--){
                            if(arr[i]==new_arr[j]){
                                ready_poker.poker.push(that.all_player[player].poker[i]);
                                new_arr.pop();
                            }
                        }
                    }
                    return true;
                }
            }
        }

        //提示4带2函数
        function hint42(arr,player,count_arr,num){//当前玩家手牌,当前玩家,出的牌的长度,点数数组,次数数组
            var new_arr=[];//临时数组
            var new_arr2=[];//临时数组2
            //找4张
            for(var i=count_arr.length-1;i>=0;i--){
                //判断是否有4张
                if(num[i]==4&&count_arr[i]>desktop_poker.max){
                    new_arr.push(count_arr[i])
                    break;
                }
            }
            //如果没有找到有4张的就退出
            if(new_arr.length!=1){
                return false;
            }
            //判断有没有2个单张
            for(var i=count_arr.length-1;i>=0;i--){
                if(num[i]==1&&count_arr[i]!=14&&count_arr[i]!=15){
                    new_arr2.push(count_arr[i])
                }
                if(new_arr2.length==2){
                    break;
                }
            }

            //如果没有单张就去找对子
            if(new_arr2.length!=2){
                new_arr2=[];
                for(var i=count_arr.length-1;i>=0;i--){
                    if(num[i]==2){
                        new_arr2.push(count_arr[i])
                        if(new_arr2.length==1){
                            break;
                        }
                    }
                }
                //如果没有对子就去找3张
                if(new_arr2.length!=1){
                    for(var i=count_arr.length-1;i>=0;i--){
                        if(num[i]==3){
                            new_arr2.push(count_arr[i])
                            if(new_arr2.length==1){
                                break;
                            }
                        }
                    }
                    //如果没有3张就去找4张
                    if(new_arr2.length!=1){
                        for(var i=count_arr.length-1;i>=0;i--){
                            if(num[i]==4&&count_arr[i]!=new_arr[0]){
                                new_arr2.push(count_arr[i])
                                if(new_arr2.length==1){
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            //如果找不到带的就return false;
            if(new_arr2.length==0){
                return false;
            }

            //去当前玩家的数组去找对应的牌
            for(var i=arr.length-1;i>=0;i--){
                if(arr[i]==new_arr[0]){
                    ready_poker.poker.push(that.all_player[player].poker[i]);
                }
            }
            //去当前玩家的数组去找对应的牌
            for(var i=arr.length-1;i>=0;i--){
                for(var j=0;j<new_arr2.length;j++){
                    if(arr[i]==new_arr2[j]){
                        ready_poker.poker.push(that.all_player[player].poker[i]);
                    }
                }
                if(ready_poker.poker.length==6){
                    break;
                }
            }
            return true;
        }

        //提示连对函数
        function hint88(arr,player,count_arr,num,length){//当前玩家手牌,当前玩家,点数数组,张数数组,出的牌的长度
            var new_arr=[];//临时数组
            var length2 = length/2;//有多少对对子
            if(desktop_poker.max>12){               //如果最大值是A，则不需要判断
                return false
            }
            //找连对
            for(var i=count_arr.length-1;i>=0;i--){
                if(num[i]==2&&count_arr[i]>desktop_poker.max){  //判断当前点数大于max值并且是有两张以上
                    new_arr.push(count_arr[i]);
                    for(var j=1;j<length2;j++){
                        if(num[i+j]==2&&count_arr[i+j-1]-1==count_arr[i+j]){    //判断下一张是否也是点数-1且有两张
                            new_arr.push(count_arr[i+j]);
                        }

                    }
                    //找到相应长队的对子就跳出循环
                    if(new_arr.length==length2){
                        break;
                    }else{
                        new_arr=[];
                    }
                }
            }

            //如果没找到就return false;
            if(new_arr.length==0||new_arr[0]>12){
                return false;
            }

            //去当前玩家的数组去找对应的牌
            for(var i=arr.length;i>=0;i--){
                for(var j=new_arr.length-1;j>=0;j--){
                    if(arr[i]==new_arr[j]){
                        ready_poker.poker.push(that.all_player[player].poker[i]);
                    }
                }
            }
        }

        //提示3带1函数
        function hint31(arr,player,count_arr,num,length){
            var new_arr=[];                                                             //临时数组
            var new_arr2=[];                                                            //临时数组2
            var three = length/4;                                                       //有多少个3张
            if(desktop_poker.max>12&&three!=1){                                     //如果3张数量为1，则可以匹配到222，否则如果最大值等A就不用比较了
                return false
            }else{
                //找3张
                for(var i=count_arr.length-1;i>=0;i--){                                 //循环遍历找到数量相等且符合-1的3张
                    if(count_arr[i]>desktop_poker.max&&num[i]==3){
                        new_arr.push(count_arr[i]);
                        for(var j=0;j<three;j++){
                            if(num[i+j+1]==3&&count_arr[i+j]-1==count_arr[i+j+1]){
                                new_arr.push(count_arr[i+j+1]);
                            }else{
                                break;
                            }
                        }
                        if(new_arr.length==three){                                      //如果找到相应长度的就跳出循环，否则就清空数组，如果找不到数组就为空
                            break;
                        }else{
                            new_arr=[];
                        }
                    }
                }


                //判断有没有单张
                for(var i=count_arr.length-1;i>=0;i--){
                    console.log(count_arr[i]);
                    if(num[i]==1&&count_arr[i]!=14&&count_arr[i]!=15){
                        new_arr2.push(count_arr[i])
                    }
                    if(new_arr2.length==three){
                        break;
                    }
                }


                for(var i=arr.length-1;i>=0;i--){
                    for(var j=new_arr.length-1;j>=0;j--){
                        if(arr[i]==new_arr[j]){
                            ready_poker.poker.push(that.all_player[player].poker[i]);
                        }
                    }
                }

                //判断是否达到条件
                if(new_arr.length<three||new_arr2<three||(new_arr[0]>12&&three!=1)){
                    return false;
                }

                //去当前玩家的数组去找对应的牌
                for(var i=arr.length-1;i>=0;i--){
                    for(var j=0;j<new_arr2.length;j++){
                        if(arr[i]==new_arr2[j]){
                            ready_poker.poker.push(that.all_player[player].poker[i]);
                        }
                    }
                    if(ready_poker.poker.length>=length){
                        break;
                    }
                }
                return true;
            }
        }

        //3带2
        function hint32(arr,player,count_arr,num,length){
            var new_arr=[];
            var new_arr2=[];
            var three = length/5;//有多少个3张
            if(desktop_poker.max>12&&three!=1){
                return false
            }else{
                //找3张
                for(var i=count_arr.length-1;i>=0;i--){
                    if(count_arr[i]>desktop_poker.max&&num[i]==3){
                        new_arr.push(count_arr[i]);
                        for(var j=0;j<three;j++){
                            if(num[i+j+1]==3&&count_arr[i+j]-1==count_arr[i+j+1]){
                                new_arr.push(count_arr[i+j+1]);
                            }else{
                                break;
                            }
                        }
                        if(new_arr.length==three){
                            break;
                        }else{
                            new_arr=[];
                        }
                    }
                }


                //判断有没有单张
                for(var i=count_arr.length-1;i>=0;i--){
                    console.log(count_arr[i]);
                    if(num[i]==2&&count_arr[i]!=14&&count_arr[i]!=15){
                        new_arr2.push(count_arr[i])
                    }
                    if(new_arr2.length==three){
                        break;
                    }
                }


                for(var i=arr.length-1;i>=0;i--){
                    for(var j=new_arr.length-1;j>=0;j--){
                        if(arr[i]==new_arr[j]){
                            ready_poker.poker.push(that.all_player[player].poker[i]);
                        }
                    }
                }

                //判断是否达到条件
                if(new_arr.length<three||new_arr2<three||new_arr[0]>12){
                    return false;
                }

                //去当前玩家的数组去找对应的牌
                for(var i=arr.length-1;i>=0;i--){
                    for(var j=0;j<new_arr2.length;j++){
                        if(arr[i]==new_arr2[j]){
                            ready_poker.poker.push(that.all_player[player].poker[i]);
                        }
                    }
                    if(ready_poker.poker.length>=length){
                        break;
                    }
                }
                return true;
            }
        }

        //全3张或全4张
        function hint33or44(arr,player,count_arr,num,length,n){                         //n纯3还是纯4
            var new_arr=[];
            var m = length/n;                                                           //m是需要多少个3张或4张
            if(desktop_poker.max>12){
                return false;
            }else{
                for(var i=count_arr.length-1;i>=0;i--){                                 //循环遍历去找存在3，4张的点数，并且为4张点数相连的
                    if(count_arr[i]>desktop_poker.max&&num[i]==n){
                        new_arr.push(count_arr[i]);
                        for(var j=0;j<m;j++){
                            if(num[i+j+1]==n&&count_arr[i+j]-1==count_arr[i+j+1]){
                                new_arr.push(count_arr[i+j+1]);
                            }else{
                                break;
                            }
                        }
                        if(new_arr.length==m){                                          //如果找到对应的长度的就跳出循环，否则清空数组
                            break;
                        }else{
                            new_arr=[];
                        }
                    }
                }

                if(new_arr.length==0||new_arr[0]>12){                                                   //如果数组为空就退出
                    return false;
                }


                for(var i=arr.length-1;i>=0;i--){                                       //否则就去当前玩家的数组去找对应的牌
                    for(var j=new_arr.length-1;j>=0;j--){
                        if(arr[i]==new_arr[j]){
                            ready_poker.poker.push(that.all_player[player].poker[i]);
                        }
                    }
                }
                return true
            }
        }

        function hint422(arr,player,count_arr,num,length){
            var new_arr=[];                                                             //临时数组
            var new_arr2=[]                                                             //临时数组2
            for(var i=count_arr.length-1;i>=0;i--){                                     //循环遍历找4张
                if(num[i]==4&&count_arr[i]>desktop_poker.max){
                    new_arr.push(count_arr[i]);
                    break;
                }
            }

            //判断有没有2个对子
            for(var i=count_arr.length-1;i>=0;i--){
                if(num[i]==2&&count_arr[i]!=14&&count_arr[i]!=15){
                    new_arr2.push(count_arr[i])
                }
                if(new_arr2.length==2){
                    break;
                }
            }

            if(new_arr.length==0||new_arr2.length!=2){                                  //判断是否有4张和两个对子了，如果没有就return false
                return false;
            }

            for(var i=arr.length-1;i>=0;i--){                                           //就去当前玩家的数组去找对应的牌
                if(arr[i]==new_arr[0]){
                    ready_poker.poker.push(that.all_player[player].poker[i]);
                }
            }

            for(var i=arr.length-1;i>=0;i--){                                           //就去当前玩家的数组去找对应的牌
                for(var j=0;j<new_arr2.length;j++){
                    if(arr[i]==new_arr2[j]){
                        ready_poker.poker.push(that.all_player[player].poker[i]);
                    }
                }
                if(ready_poker.poker.length==length){                                               //如果达到长度就不存了
                    break;
                }
            }
        }

    },

    /*------找炸弹函数---------------------------------------------*/

    findBomb:function (player) {
        var that = this;
        ready_poker = {poker:[], type:0, max:0};        //刷新准备的对象
        var arr = [];           //临时数组
        var player_poker = [];  //用于存玩家手牌的点数
        var count_arr = [];     //出现了什么点数
        var num = [];           //出现点数的次数

        //获取点数
        for(var i=0;i<that.all_player[player].poker.length;i++){
            arr.push(that.all_player[player].poker[i].split('_'));
            player_poker.push(Number(arr[i][0]));
        }

        //去重获取点数，并获取有多少张
        for(var i=0;i<player_poker.length;i++){
            if(count_arr.indexOf(player_poker[i]) == -1){
                count_arr.push(player_poker[i]);
                num.push(1);
            }else{
                var x = count_arr.indexOf(player_poker[i]);
                num[x] += 1;
            }
        }

        //判断当前类型是否是炸弹，如果不是则执行
        if(hintBomb(player_poker,player,count_arr,num)){
            return true;
        }else if(hintKingBomb(player_poker,player)){
            return true
        }else{
            return false;
        }

        //判断是否有普通炸弹
        function hintBomb(arr,player,count_arr,num){
            var new_arr = [];
            if(desktop_poker.type==999){
                for(var i=arr.length-1;i>=0;i--){
                    if(num[i]==4&&count_arr[i]>desktop_poker.max){
                        new_arr.push(count_arr[i]);
                    }
                    if(new_arr.length==1){
                        break;
                    }
                }
            }else{
                for(var i=arr.length-1;i>=0;i--){
                    if(num[i]==4){
                        new_arr.push(count_arr[i]);
                    }
                    if(new_arr.length==1){
                        break;
                    }
                }
            }

            if(new_arr.length==0){
                return false;
            }else{
                for(var i=arr.length-1;i>=0;i--){
                    if(arr[i]==new_arr[0]){
                        ready_poker.poker.push(that.all_player[player].poker[i]);
                    }
                }
            }
            return true;
        }

        function hintKingBomb(arr,player){                                              //判断是否有王炸
            if(arr[0]==15&&arr[1]==14){                                                 //判断当前点数是否是16,17
                ready_poker.poker.push(that.all_player[player].poker[0]);
                ready_poker.poker.push(that.all_player[player].poker[1]);
                return true;
            }
            return false;
        }


    },

    /*--------拖拽按下函数--------------------------------------*/

    dragDown:function (e,poker) {
        var that = this;
        if(that.flag.over_land_grab&&that.flag.player ==1){
            that.drag.start_left = e.pageX;
            that.drag.flag=1;                            //判断是否按着鼠标
            poker.$bottom.mousemove(function(e){
                if(that.drag.flag==1){
                    that.drag.end_left = e.pageX;        //获取鼠标与mid_buttom的做偏移量
                    for(var i=0;i<that.all_player[1].poker.length;i++){
                        that.drag.current_left = $('.player2_poker li').eq(i).offset().left;     //循环判断每一个li的left值是否在拖拽的范围内
                        if(that.drag.current_left<=that.drag.start_left&&that.drag.current_left>=that.drag.end_left||that.drag.current_left>=that.drag.start_left&&that.drag.current_left<=that.drag.end_left){
                            $('.player2_poker li').eq(i).find('div').css({opacity:'0.3'});  //如果在范围内则变颜色
                        }else{
                            $('.player2_poker li').eq(i).find('div').css({opacity:'0'});
                        }
                    }
                }

            });
            return false;
        }
    },


    /*--------拖拽抬起函数--------------------------------------*/

    dragUp:function (e) {

        var that = this
        if(that.flag.over_land_grab&&that.flag.player ==1){
            that.drag.flag=0;                                                    //当鼠标松开时，不再执行移动时的事件
            that.drag.end_left = e.pageX;                                        //获取结束时鼠标的左偏移量
            for(var i=0;i<that.all_player[1].poker.length;i++){
                that.drag.current_left = $('.player2_poker li').eq(i).offset().left; //循环获取每个li的左偏移量
                var top = $('.player2_poker li').eq(i).css('top');
                if(that.drag.current_left<=that.drag.start_left&&that.drag.current_left>=that.drag.end_left||that.drag.current_left>=that.drag.start_left&&that.drag.current_left<=that.drag.end_left){     //如果li在开始和结束之间改变自身的高度，并且颜色变回原来
                    if(top != '-10px'){
                        $('.player2_poker li').eq(i).find('div').eq(0).css({opacity:'0'});
                        $('.player2_poker li').eq(i).css({top:'-10px'});
                        ready_poker.poker.push($('.player2_poker li').eq(i).attr('data-value'));
                        this.sort_showPoker(ready_poker.poker);
                    }else if(top == '-10px'){
                        $('.player2_poker li').eq(i).find('div').eq(0).css({opacity:'0'});
                        $('.player2_poker li').eq(i).css({top:'0px'});
                        var index = ready_poker.poker.indexOf($('.player2_poker li').eq(i).attr('data-value'));
                        ready_poker.poker.splice(index, 1);
                    }
                }
            }
        }
    },

    /*-------------重新绑定-----------------------------*/

    binding:function(poker){
        poker.$mid_top=$('.mid_top'),
        poker.$all_poker=$('.all_poker'),
        poker.$back=$('.back'),
        poker.$alarm=$('.alarm'),
        poker.$mingpai=$('.mingpai'),
        poker.$all_poker_li=$('.all_poker li'),
        poker.$play1_poker=$('.player1_poker'),
        poker.$play1_poker_li=$('.player1_poker li'),
        poker.$play2_poker=$('.player2_poker'),
        poker.$play2_poker_li=$('.player2_poker li'),
        poker.$play3_poker=$('.player3_poker'),
        poker.$play3_poker_li=$('.player3_poker li'),
        poker.$three_poker=$('.three_poker'),
        poker.$three_poker_li=$('.three_poker li'),
        poker.$right=$('.right'),
        poker.$left=$('.left'),
        poker.$play=$('.play'),
        poker.$no_play=$('.no_play'),
        poker.$land_grab=$('.land_grab'),
        poker.$not_call=$('.not_call'),
        poker.$left_name=$('.left .name'),
        poker.$bottom_name=$('.bottom .name'),
        poker.$right_name=$('.right .name'),
        poker.$button_container=$('.button_container'),
        poker.$play_event=$('.play_event'),
        poker.$a1=$('.a1'),
        poker.$bottom=$('.bottom'),
        poker.$over=$('.over'),
        poker.$mom=$('.mom'),
        poker.$add=$('.add')
    },



/*    showClock2:function(){
        clearTime5 = setInterval(this.tutu,1000);
    },


    tutu:function(){
        this = window
        var that = this.LandLoads.prototype;
        console.log(that)
        that.tiaotiao();
    },


    tiaotiao:function(){
        alert(1);
    },*/






    /*--------重新开始函数-----------------------------*/

    playAgain:function(poker){
        $('#ado').attr('src','./audio/01.mp3');

        this.binding(poker);

        clearInterval(clearTime1);

        clearInterval(clearTime4);

        clearInterval(clearTime5);

        poker.$play1_poker_li.remove();

        poker.$play2_poker_li.remove();

        poker.$play3_poker_li.remove();

        poker.$all_poker_li.remove();

        poker.$three_poker_li.remove();

        poker.$button_container.hide();

        poker.$play_event.hide();

        console.log(poker.$add.eq(0).html())

        poker.$left_name.html('');

        poker.$bottom_name.html('');

        poker.$right_name.html('');

        score.player0 = score.player0+Number(poker.$add.eq(0).html());

        score.player1 = score.player1+Number(poker.$add.eq(1).html());

        score.player2 = score.player2+Number(poker.$add.eq(2).html());

        this.InitFrame(poker);

        this.setInfo(poker);

        poker.$mom.val(this.all_player[0].multiple);

        this.all_player[0].integral = 100+score.player0;

        this.all_player[1].integral = 100+score.player1;

        this.all_player[2].integral = 100+score.player2;

        $('.grade').eq(0).val(this.all_player[0].integral);

        $('.grade').eq(1).val(this.all_player[1].integral);

        $('.grade').eq(2).val(this.all_player[2].integral);

        this.binding(poker);

    },





}