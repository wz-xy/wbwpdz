$(function(){
	$('.news-tab li').click(function(){
	    var tabli = $(this).index();//获取选中元素的下标
	    $(this).addClass("news-tabact").siblings().removeClass("news-tabact");
	    $(".news-conlist").eq(tabli).show().siblings(".news-conlist").hide();
	});
    $('.twomenu a').click(function(){
	    var tabli = $(this).index();//获取选中元素的下标
		$(".news-tab li").eq(tabli).addClass("news-tabact").siblings().removeClass("news-tabact");
		$(".news-conlist").eq(tabli).show().siblings(".news-conlist").hide();
	});
	//获取地址栏中的参数
	var indexnum=getQueryString("indexnum") || 0;   
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
    $(".news-tab li").eq(indexnum).addClass("news-tabact").siblings().removeClass("news-tabact");
	$(".news-conlist").eq(indexnum).show().siblings(".news-conlist").hide();
})
