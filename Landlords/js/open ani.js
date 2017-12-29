

function PlaceFieldEditor($parentEle){
	$('#ado').attr('src','./audio/333.mp3');
// var fragmentConfig = {
// 	container : '.img-flex',//显示容器
// 	line :4,//多少行
// 	column : 4,//多少列
// 	width:Number($(window).width()),//显示容器的宽度
// 	animeTime : 10000,//最长动画时间,图片的取值将在 animeTime*0.33 + animeTime*0.66之前取值 
// 	img : 'images/03.jpg'//图片路径
// };

// fragmentImg(fragmentConfig);
// setTimeout(function(){
// 	$('.popup-container').remove();
// },10000);


	this.$parentEle = $parentEle;		// 父级DOM元素

	this.initElements();			// 实例化后需要执行初始化页面元素的方法
	this.initEvents();				// 实例化后需要绑定所有页面元素的事件
}
PlaceFieldEditor.prototype = {
	constructor:PlaceFieldEditor,	// 定义构造函数来自哪里

	initElements:function(){
		this.$d1=$('<div class="d1" />');
		this.$d2=$('<div class="d2" />');
		this.$d3=$('<div class="d3" />');
		this.$d4=$('<div class="d4" />');

		this.$dd1=$('<div class="dd1" />');
		this.$dd2=$('<div class="dd2" />');
		this.$dd3=$('<div class="dd3" />');
		this.$dd4=$('<div class="dd4" />');

		this.$d1_1=$('<div class="d1_1" />');
		this.$d1_2=$('<div class="d1_2" />');
		this.$d2_1=$('<div class="d2_1" />');
		this.$d2_2=$('<div class="d2_2" />');
		this.$d3_1=$('<div class="d3_1" />');
		this.$d3_2=$('<div class="d3_2" />');
		this.$d4_1=$('<div class="d4_1" />');
		this.$d4_2=$('<div class="d4_2" />');

		this.$dd1.append(this.$d1_1).append(this.$d1_2);
		this.$dd2.append(this.$d2_1).append(this.$d2_2);
		this.$dd3.append(this.$d3_1).append(this.$d3_2);
		this.$dd4.append(this.$d4_1).append(this.$d4_2);

		this.$d1.append(this.$dd1);
		this.$d2.append(this.$dd2);
		this.$d3.append(this.$dd3);
		this.$d4.append(this.$dd4);

		this.$parentEle.append(this.$d1)
		.append(this.$d2)
		.append(this.$d3)
		.append(this.$d4)

	},
	initEvents:function(){
		var that=this;
		this.$parentEle.show();
		this.$d1.css({'width':''+($(window).width())*0.5+'','height':''+$(window).height()*0.5+''});
		this.$d2.css({'width':''+($(window).width())*0.5+'','height':''+$(window).height()*0.5+''});
		this.$d3.css({'width':''+($(window).width())*0.5+'','height':''+$(window).height()*0.5+''});
		this.$d4.css({'width':''+($(window).width())*0.5+'','height':''+$(window).height()*0.5+''});

		this.$dd1.on('click',function(){
			
			 that.dian();
			 setTimeout(function(){
				that.showPoke();
			},1000);
		});
		this.$dd2.on('click',function(){
			
			 that.dian();
			 setTimeout(function(){
				that.showPoke();
			},1000);
		});
		this.$dd3.on('click',function(){
			
			 that.dian();
			 setTimeout(function(){
				that.showPoke();
			},1000);
		});
		this.$dd4.on('click',function(){
			
			 that.dian();
			 setTimeout(function(){
				that.showPoke();
			},1000);
		});
		this.$d2_1.css('background-position','-'+this.$d2_1.width()+'px -68px');
		this.$d2_2.css('background-position','-'+this.$d2_2.width()+'px -68px');

		this.$d3_1.css('background-position','0px -'+(this.$d3_1.height()+68)+'px');
		this.$d3_2.css('background-position','0px -'+(this.$d3_2.height()+68)+'px');

		this.$d4_1.css('background-position','-'+this.$d4_1.width()+'px -'+(this.$d4_1.height()+68)+'px');
		this.$d4_2.css('background-position','-'+this.$d4_2.width()+'px -'+(this.$d4_2.height()+68)+'px');

	},
	dian:function(){
			this.$dd1.animate({top:'0%'},1000);
			this.$dd2.animate({left:'-100%'},1000);
			this.$dd3.animate({left:'0%'},1000);
			this.$dd4.animate({top:'-100%'},1000);
	},
	showPoke:function(){
		$('.poker').animate({opacity:'1'},1000);
		this.$parentEle.remove();
	}
	};
function Play_poker($me){
	this.$me=$me;
	
	this.initElements();			// 实例化后需要执行初始化页面元素的方法
	this.initEvents();	

}
var cl=0;
var n=60;//开扇元素
var m=-1;//闭扇元素
var t=-1;
Play_poker.prototype = {
	constructor:Play_poker,	// 定义构造函数来自哪里
	initElements:function(){
		this.$q5=$('<ul class="q5" />');
		this.$q1=$('<ul class="quan q1" />');
		this.$q2=$('<ul class="q2" />');
		this.$q3=$('<ul class="q3" />');
		this.$q4=$('<ul class="q4" />');
		for(var i=0;i<60;i++){
			this.$q1.append($('<li class="first" />'));
		};

		this.$me.append(this.$q5)
		.append(this.$q1)
		.append(this.$q2)
		.append(this.$q3)
		.append(this.$q4)
	},
	initEvents:function(){
		var that=this;
		this.$q1.click(function(){
			cl++;
			that.shan(n);
			if(cl==2){
 				that.move(); 
 	 			that.fan(m);
 	 			setTimeout(function(){
			 		 that.fen();
			 	   that.bianhua();
			 	},2000)
		}
	});
		this.$q5.click(function(){
		var n=60;
		var m=-1;
		var t=-1;
		that.fan(m);
		setTimeout(function(){
			$('.poker').animate({opacity:'0'},1000,function(){
				$('.poker').remove();
			});
			$('.ceng').animate({opacity:'0'},1000,function(){
				$('.ceng').remove();
				$('#ado').attr('src','./audio/01.mp3');
			})


		},2000)
	 });
	},
	shan:function(t){
		if(t<1||cl>1){
			return false ;
		}else{
			$('.first').eq(t).animate({a:''+(360-t*6)+''},{
			step:function(now,fx){
			$(".first").eq(t).css({"transform":"rotate("+now+"deg)"})}
			,duration:500})
			t--;
			this.shan(t);
			 
		}
	},
	fan:function(e){
		if(e>60){
			return false ;
		}else{
			$('.first').eq(e).animate({a:'0'},{
			step:function(now,fx){
				fx.start=354-e*6;//你可以尝试修改start,end值，来看rotate的变化
	              fx.end=0;		  
			$(".first").eq(e).css({"transform":"rotate("+now+"deg)"})}
			,duration:1000})
			e++;
			this.fan(e);	 
		}
	},
	move:function() {
//-----自转---------------------------------
		this.$q1.animate({left: '-690px', top: '-540px'}, 500);
		for (var i = 0; i < 15; i++) {
			$('.first').eq(i).animate({top: ['350px'], left: ['12px']}, 500)
		}
		for (var i = 15; i < 30; i++) {
			$('.first').eq(i).animate({left: '400px', top: '345px'}, 500)
		}
		for (var i = 30; i < 45; i++) {

			$('.first').eq(i).animate({left: '400px', top: '-5px'}, 500)
		}
		for (var i = 45; i < 60; i++) {
			$('.first').eq(i).animate({top: '0px', left: '0px'}, 500)
		}
	
	},
	fen:function(){
	$('.first').remove();
	for(var i=0; i<15; i++){
		this.$q1.append('<li class="first"></li>');
		this.$q2.append('<li class="first"></li>');
		this.$q3.append('<li class="first"></li>');
		this.$q4.append('<li class="first"></li>');
		}
	 	// $('.quan').remove();

	},
	bianhua:function(){
	var t=0;//变化元素
		this.$q1.animate({left:'-280%',top:'-100%'},1000);
		this.$q2.animate({left:'-100%',top:'24%'},1000);
		this.$q3.animate({left:'-100%',top:'60%'},1000);
		this.$q4.animate({left:'-100%',top:'100%'},1000);		
	function ping(i){
		if(t>15){
			return false;
		}else{
			$('.q1 .first').eq(i).animate({left:''+105*i+'%'},1000);
			$('.q2 .first').eq(i).animate({left:''+106*i+'%'},1000);
			$('.q3 .first').eq(i).animate({left:''+107*i+'%'},1000);
			$('.q4 .first').eq(i).animate({left:''+108*i+'%'},1000);
			t++;
			ping(t);
		}	
	}//ping结尾
		function luo(){
			var t=0;
			$('.q1').animate({left:'-300%',top:'170%'},1000);
			$('.q2').animate({left:'-102%',top:'120%'},1000);
			$('.q3').animate({left:'-98%',top:'120%'},1000);
			$('.q4').animate({left:'-94%',top:'120%'},1000);

				function yun(i){
					if(t>15){
						return false;
					}else{
					$('.q1 .first').eq(i).animate({left:''+28*i+'%'},1000);
					$('.q2 .first').eq(i).animate({left:''+(300+28*i)+'%'},1000);
					$('.q3 .first').eq(i).animate({left:''+(700+28*i)+'%'},1000);
					$('.q4 .first').eq(i).animate({left:''+(1100+28*i)+'%'},1000);
					t++;
					yun(t);
					}
				}
				yun(t);	
			}//luo结尾
			var r=1;
	function xin(){
		if(r>60){
			return false;
		}else{
			// $('.back:first').animate({left:'680px',top:'-400px'},30);
			$('.first:last').animate({left:'680px',top:'-400px'},30);

		setTimeout(function(){
			// $('.back:first').remove();
			$('.first:last').remove();
			jia(r);
			r++;
			xin();

			
		},40);
		
		};
		function jia(r){
			$('.q5').append('<li class="first" style="transform:rotate('+(360-6*r)+'deg)"></li>')
		}
		
	}

		setTimeout(function(){
			ping(t);
			setTimeout(function(){
				luo();
				setTimeout(function(){
					xin();

				},1000);

			},1000);
		},1000);

		}
}
