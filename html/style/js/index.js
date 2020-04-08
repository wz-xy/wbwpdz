$(function(){
	//滚动
	$('.index-scroll').liMarquee({
		direction: 'up',
		runshort: false, //内容不足不滚动
		scrollamount: 25 //滚动速度，越大越快
	});
	//应用案例切换
    $(".index-tab li").on("click",function(){
        var indexli=$(this).index();
        $(this).addClass("index-tabact").siblings().removeClass("index-tabact");
        $(this).parents(".index-contab").find(".index-con .index-conlist").eq(indexli).addClass("index-conact").siblings().removeClass("index-conact");
    });
    //banner幻灯片
    $(".index-diaporama").jDiaporama({
        delay: 5,   // 延迟时间为3秒
        infos: false, //标题显示
    });
    $(".index-diaporama li").each(function(){
    	let srcd="url("+$(this).find("img").prop("src")+") no-repeat center top"
    	//srcd += "url()"
    	console.log(typeof(srcd))
    	console.log(srcd)
    	$(this).find("a").css("background",srcd)
//  	$(this).find("a").prop("background-image",+srcd)
    	console.log(10)
    })
})