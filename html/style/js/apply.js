$(function(){
	 //切换
	 $(".tab li").on("click",function(){
		var indexli=$(this).index();
		$(this).addClass("ac").siblings().removeClass("ac")
	}) 
	//banner背景
	let srcd="url("+$(".applyimgad img").prop("src")+") no-repeat center top"
	$(".applyimgad").css("background",srcd)
	let srccon="url("+$(".applypic img").prop("src")+") no-repeat center top"
	$(".applypic").css("background",srccon)
	//放大图
	$(".picdiv li img").on("click",function(){
		var srcd=$(this).prop("src");
		console.log(srcd)
		$(".dialog").show(100);
		$(".diabg").show();
		$(".dialog").find("img").prop("src",srcd)
	})
	$(".disclose").on("click",function(){
		$(".dialog").hide(100);
		$(".diabg").hide();
	})
	auto()
	function auto(){
		//图片轮播
		var length, 
		currentIndex = 0, 
		interval, 
		hasStarted = false, //是否已经开始轮播 
		t = 3000; //轮播时间间隔 
		length = $('.slider-panel').length; 
		//将除了第一张图片隐藏 
		$('.slider-panel:not(:first)').hide(); 
		//将第一个slider-item设为激活状态 
		$('.slider-item:first').addClass('slider-item-selected'); 
		//隐藏向前、向后翻按钮 
		//$('.slider-page').hide(); 
		//鼠标上悬时显示向前、向后翻按钮,停止滑动，鼠标离开时隐藏向前、向后翻按钮，开始滑动 
		$('.slider-panel, .slider-pre, .slider-next').hover(function() { 
				stop(); 
				$('.slider-page').show(); 
		}, function() { 
				//$('.slider-page').hide(); 
				start(); 
		}); 
		$('.slider-item').hover(function(e) { 
				stop(); 
				var preIndex = $(".slider-item").filter(".slider-item-selected").index(); 
				currentIndex = $(this).index(); 
				play(preIndex, currentIndex); 
		}, function() { 
				start(); 
		}); 
		$('.slider-pre').unbind('click'); 
		$('.slider-pre').bind('click', function() { 
				pre(); 
		}); 
		$('.slider-next').unbind('click'); 
		$('.slider-next').bind('click', function() { 
				next(); 
		}); 
		/** 
			* 向前翻页 
			*/
			function pre() { 
				var preIndex = currentIndex; 
				currentIndex = (--currentIndex + length) % length; 
				play(preIndex, currentIndex); 
		} 
		/** 
			* 向后翻页 
			*/
		function next() { 
				var preIndex = currentIndex; 
				currentIndex = ++currentIndex % length; 
				play(preIndex, currentIndex); 
		} 
		/** 
			* 从preIndex页翻到currentIndex页 
			* preIndex 整数，翻页的起始页 
			* currentIndex 整数，翻到的那页 
			*/
		function play(preIndex, currentIndex) { 
				$('.slider-panel').eq(preIndex).fadeOut(500) 
				.parent().children().eq(currentIndex).fadeIn(1000); 
				$('.slider-item').removeClass('slider-item-selected'); 
				$('.slider-item').eq(currentIndex).addClass('slider-item-selected'); 
		} 
		/** 
			* 开始轮播 
			*/
		function start() { 
				if(!hasStarted) { 
					hasStarted = true; 
					interval = setInterval(next, t); 
				} 
		} 
		/** 
			* 停止轮播 
			*/
		function stop() { 
				clearInterval(interval); 
				hasStarted = false; 
		} 
		//开始轮播 
		start(); 
	}
	
  
})
