// JavaScript Document

new WOW().init();

$(window).scroll(function(){
    var windowTop=$(window).scrollTop();
    if(windowTop>40){
        $('nav').addClass('cc');
    }else{
        $('nav').removeClass('cc');
    };
});

$('.carousel').carousel({
    pause:'false',
});

// <!--------------------------------------------------------scroll-------------------------------------------------------->

$('.nav-link,a').click(function(){
    var t=$(this).attr('href');
    var st=$(t).offset().top-50;
    $('html,body').animate({
        scrollTop:st
    },500);
});

// <!--------------------------------------------------------robot-------------------------------------------------------->

$('.r_body').delay(5000).fadeOut('slow');
$('#robot').click(function(){
    ($(this).html());
    sleep();
});

var r=true;

function sleep(){
    $('.r_body').toggle(function(){
        $('.r_body').css({opacity:1,height:350});
        if(r){
            $('#robot').addClass('animate__animated animate__rubberBand').bind('animationend',function(){
                $(this).removeClass('animate__animated animate__rubberBand');
            });
            $('#robot').removeClass('robot_pic').addClass('glyphicon glyphicon-remove');
            r=!r;
        }else{
            $('#robot').addClass('animate__animated animate__rubberBand').bind('animationend',function(){
                $(this).removeClass('animate__animated animate__rubberBand');
            });
            $('#robot').removeClass('glyphicon glyphicon-remove').addClass('robot_pic');
            r=!r;
        };
    });
};

function getDate(){
    var today=new Date();
    if(today.getHours()<13){
        return '上午'+today.getHours()+':'+today.getMinutes();
    }else{
        return '下午'+today.getHours()+':'+today.getMinutes();
    };
};

function keyin(event){
    if(event.which==13){
        $('#rsay_to').append('<div class="row rr_div"><div class="talk">'+$('#r_say').val()+'<br>'+getDate()+'</div><div class="r_p r_pic"><span class="glyphicon glyphicon-user"></span></div>');
        $('#r_say').val("");
        answer(3);
    };
};

$('.btn-send').each(function(s){
    $(this).click(function(){
        if(s==0){
            $('#rsay_to').append('<div class="row rr_div"><div class="talk">訂購<br>'+getDate()+'</div><div class="r_p r_pic"><span class="glyphicon glyphicon-user"></span></div>');
        };
        if(s==1){
            $('#rsay_to').append('<div class="row rr_div"><div class="talk">推薦<br>'+getDate()+'</div><div class="r_p r_pic"><span class="glyphicon glyphicon-user"></span></div>');
        };
        if(s==2){
            $('#rsay_to').append('<div class="row rr_div"><div class="talk">服務<br>'+getDate()+'</div><div class="r_p r_pic"><span class="glyphicon glyphicon-user"></span></div>');
        };
        answer(s);
    });
});

function answer(s){
    setTimeout(function(){
        if(s==3){
            $('#rsay_to').append(QA());
        };
        if(s==0){
            $('#rsay_to').append('<div class="row r_div"><img src="images/robot.png" class="r_pic"><div class="r_hi">前往線上訂購，選擇您所喜愛的口味並下訂！<br>'+getDate()+'</div></div>');
            var t=$('#order').offset().top-50;
            $('html,body').animate({
                scrollTop:t
            },500);
        };
        if(s==1){
            $('#rsay_to').append('<div class="row r_div"><img src="images/robot.png" class="r_pic"><div class="r_hi">藉由熱銷推薦整理，查看近期最暢銷項目Top.1！<br>'+getDate()+'</div></div>');
            var t=$('#report').offset().top-50;
            $('html,body').animate({
                scrollTop:t
            },500);
        };
        if(s==2){
            $('#rsay_to').append('<div class="row r_div"><img src="images/robot.png" class="r_pic"><div class="r_hi">若有問題請至服務中心留言，我們將迅速為您處理！<br>'+getDate()+'</div></div>');
            var t=$('#board').offset().top-50;
            $('html,body').animate({
                scrollTop:t
            },500);
        };
        var e=document.getElementById('rsay_to');
        e.scrollTop=e.scrollHeight;
        e.scrollLeft=e.scrollLeft;
    },500);
};

function QA(){
    return '<div class="row r_div"><img src="images/robot.png" class="r_pic"><div class="r_hi">感謝您提供建議與問題，稍後將有專人為您服務！<br>'+getDate()+'</div></div>';
};

// <!--------------------------------------------------------message board-------------------------------------------------------->

function chat(){
    cn=$('#cname').val();
    ce=$('#cemail').val();
    ct=$('#ctext').val();
    if(ce.indexOf('@')>0){
        data=cn+"&&"+ce+"&&"+ct;
        s=localStorage.s;
        if(cn!=""&&ce!=""){
            if(s==null){
                s=data;
            }else{
                s=s+"||"+data;
            };
        };
        $('#cname').val("");
        $('#cemail').val("");
        $('#ctext').val("");
        localStorage.s=s;
        alert('資料已送入後台及客戶服務紀錄');
        report();
    };
};

report();

function report(){
    ck=localStorage.s;
    if(ck!=null){
        $('#chat_to').html();
        a=ck.split("||");
        $('#chat_c').html(a.length);
        $('#chat_to').append('<ul>');
        for(i=0;i<a.length;i++){
            b=a[i].split("&&");
            if(a[i]!=""){
                $('#chat_to').append('<li class="chat-box"><b class="chat-tit"><span>'+
                b[0]+'</span><span>'+
                b[1].substr(0,5)+'*********'+'</span></b><box>'+
                b[2]+'</box></li>');
            };
        };
        var e=document.getElementById('chat_to');
        e.scrollTop=e.scrollHeight;
        $('#chat_to').append('</ul>');
        $('.chat-box').last().addClass('animate__animated animate__rubberBand').bind('animationend',function(){
            $(this).removeClass('animate__animated animate__rubberBand');
        });   
    };
};

// <!--------------------------------------------------------chart-------------------------------------------------------->

var ctx=
document.getElementById('myChart').getContext('2d');
Chart.defaults.font.size=18;
var myChart=new Chart(ctx,{
    type:'polarArea',
    data:{
        labels:['柴燒黑糖口味','馬告胡椒口味','四川麻辣口味','木瓜牛奶口味','雙倍起司口味','經典原味爆米'],
        datasets:[{
            data:[20,18,19,18,19,20],
            backgroundColor:[
                'rgba(255,92,51,0.5)',
                'rgba(255,92,0,0.5)',
                'rgba(255,0,50,0.5)',
                'rgba(28,190,161,0.5)',
                'rgba(28,190,0,0.5)',
                'rgba(28,72,161,0.5)'
            ],borderColor:[
                'rgba(255,92,51,1)',
                'rgba(255,92,0,1)',
                'rgba(255,0,50,1)',
                'rgba(28,190,161,1)',
                'rgba(28,190,0,1)',
                'rgba(28,72,161,1)'
            ],borderWidth:3
        }],
    },options:{
        plugins:{
            legend:{
                position:'bottom',
            },
        },
    },
});

// <!--------------------------------------------------------ilike-------------------------------------------------------->

var h=true;

function ilike(t){
    $(this).click(function(){
        if(h){
            $('#uplike'+t).removeClass('glyphicon glyphicon-heart-empty orange fw').addClass('glyphicon glyphicon-heart orange fw').addClass('animate__animated animate__rubberBand').bind('animationend',function(){
                $(this).removeClass('animate__animated animate__rubberBand');
            });
            num=parseInt($('#i-like'+t).text());
            num=num+1;
            $('#i-like'+t).html(num);
            h=!h;
        }else{
            $('#uplike'+t).removeClass('glyphicon glyphicon-heart orange fw').addClass('glyphicon glyphicon-heart-empty orange fw');
            num=parseInt($('#i-like'+t).text());
            num=num-1;
            $('#i-like'+t).html(num);
            h=!h;
        };
    });
};

// <!--------------------------------------------------------shop-------------------------------------------------------->

$('.shop_add').each(function(i){
    $(this).click(function(){
        t=$('.shop_num').eq(i).val();
        t++;
        $('.shop_num').eq(i).val(t);
        cc();
    });
});

$('.shop_min').each(function(i){
    $(this).click(function(){
        t=$('.shop_num').eq(i).val();
        n=parseInt(t)-1;
        $('.shop_num').eq(i).val(n);
        if(n>=0){
            $('.shop_num').eq(i).val(n);
        }else{
            $('.shop_num').eq(i).val(0);
        };
        cc();
    });
});

$('.shop_num').change(function(){
    cc();
});

$('.shop_item>h5').hide();

function cc(){
    nowM=
    $('.shop_num').eq(0).val()*150+
    $('.shop_num').eq(1).val()*150+
    $('.shop_num').eq(2).val()*150+
    $('.shop_num').eq(3).val()*150+
    $('.shop_num').eq(4).val()*120+
    $('.shop_num').eq(5).val()*100;
    $('#cart_sum').text(nowM);
    $('#cart_all').text(nowM+60);
    $('#cart_sum,#cart_all').addClass('animate__animated animate__rubberBand').bind('animationend',function(){
        $(this).removeClass('animate__animated animate__rubberBand');
    });   

    for(n=0;n<=5;n++){
        x=$('.shop_num').eq(n).val()*1;
        $('.shop_no').eq(n).text(x);
        if(x>0){
            $('.shop_item>h5').eq(n).show();
        }else{
            $('.shop_item>h5').eq(n).hide();
        };
    };
};

$('#shop_close').click(function(){
    for(n=0;n<=5;n++){
        tmp=myChart.data.datasets[0].data[n];
        nt=parseInt($('.shop_num').eq(n).val());
        myChart.data.datasets[0].data[n]=tmp+nt;
    };

    var t=$('#report').offset().top-50;
    $('html,body').animate({
        scrollTop:t
    },500,function(){
        myChart.update();
    });

    $('.shop_no').text(0);
    $('.shop_num').val(0);
    $('#cart_sum').text(0);
    $('#cart_all').text(0);
    $('.shop_item>h5').hide();
});

// <!--------------------------------------------------------animate-------------------------------------------------------->

$('.o_img').hover(function(){
    $(this).addClass('animate__animated animate__flip');
}).bind('animationend',function(){
    $(this).removeClass('animate__animated animate__flip');
});

$('.nav-link,.gly-link,a,.shop_add,.shop_min').click(function(){
    $(this).addClass('animate__animated animate__rubberBand');
}).bind('animationend',function(){
    $(this).removeClass('animate__animated animate__rubberBand');
});

// <!--------------------------------------------------------user-------------------------------------------------------->

$('#user_t').click(function(){
    $('#user_b').html('<strong>B016會員</strong><br>於彰化市登入');
});