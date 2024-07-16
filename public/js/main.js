(function ($) {
"use strict";
    
    

/*--------------------------
preloader
---------------------------- */	

$(window).on('load',function(){
    var pre_loader = $('#preloader')
pre_loader.fadeOut('slow',function(){$(this).remove();});
});	

// meanmenu
$('#mobile-menu').meanmenu({
	meanMenuContainer: '.mobile-menu',
	meanScreenWidth: "992"
});


/*---------------------
 TOP Menu Stick
--------------------- */
	
var windows = $(window);
var sticky = $('#sticker');

windows.on('scroll', function() {
    var scroll = windows.scrollTop();
    if (scroll < 300) {
        sticky.removeClass('stick');
    }else{
        sticky.addClass('stick');
    }
});
    
/*--------------------------
 MagnificPopup
---------------------------- */	
	
    $('.video-play').magnificPopup({
        type: 'iframe'
    });
    
    
/*---------------------
 Counter .js
--------------------- */
  $('.count').counterUp({
    delay: 10,
    time: 1000
  });

/*---------------------
 wow .js
--------------------- */
    function wowAnimation(){
        new WOW({
            offset: 100,          
            mobile: true
        }).init()
    }
    wowAnimation()	
    
// scrollToTop
$.scrollUp({
	scrollName: 'scrollUp', // Element ID
	topDistance: '300', // Distance from top before showing element (px)
	topSpeed: 300, // Speed back to top (ms)
	animation: 'fade', // Fade, slide, none
	animationInSpeed: 200, // Animation in speed (ms)
	animationOutSpeed: 200, // Animation out speed (ms)
	scrollText: '<i class="ti-arrow-up"></i>', // Text for element
	activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
});
	

	// data - background
	$("[data-background]").each(function () {
		$(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
	})

	$("[data-bg-color]").each(function () {
		$(this).css("background", $(this).attr("data-bg-color"))
	})

/*---------------------
 Testimonial carousel
---------------------*/
	
    var review = $('.testimonial-carousel');
    review.owlCarousel({
		loop:true,
		nav:true,
        margin:30,
		center:true,
        navText: ["<i class='ti-angle-left'></i>","<i class='ti-angle-right'></i>"],
		dots:false,
		autoplay:false,
		responsive:{
			0:{
				items:1
			},
			768:{
				items:1
			},
			1000:{
				items:2
			}
		}
	});
/*---------------------
 Support carousel
---------------------*/
	
    var support = $('.support-carousel');
    support.owlCarousel({
		loop:true,
		nav:false,
        margin:30,
		dots:true,
		autoplay:false,
		responsive:{
			0:{
				items:1
			},
			768:{
				items:1
			},
			1000:{
				items:1
			}
		}
	});
/*---------------------
 Brand carousel
---------------------*/
	
    var brand = $('.brand-carousel');
    brand.owlCarousel({
		loop:true,
		nav:false,
        margin:30,
		dots:true,
		autoplay:false,
		responsive:{
			0:{
				items:2
			},
			768:{
				items:4
			},
			1000:{
				items:6
			}
		}
	});
$('.dashboard-right-menus>li').on('click', function(){
      $('.dashboard-right-menus>li').children('.notification-area').removeClass('active');
      $('.notify-overlay').addClass('active');
      $(this).children('.notification-area').addClass('active');
    })
    $('.notify-overlay').on('click', function(){
      $('.dashboard-right-menus>li').children('.notification-area').removeClass('active');
      $(this).removeClass('active');
})
     $('.overlay').on('click', function () {
      $('.dashboard-right-menus>li').children('.notification-area').removeClass('active');
    })
    
 $('.header-dashboard-top').on('click', function () {
      $('.header-dashboard-top').toggleClass('active');
      $('.overlay').toggleClass('active');
    })

/*----------------------------
    Contact form
------------------------------ */
	$("#contactForm").on("submit", function (event) {
		if (event.isDefaultPrevented()) {
			formError();
			submitMSG(false, "Did you fill in the form properly?");
		} else {
			event.preventDefault();
			submitForm();
		}
	});
	function submitForm(){
		var name = $("#name").val();
		var email = $("#email").val();
		var msg_subject = $("#msg_subject").val();
		var message = $("#message").val();


		$.ajax({
			type: "POST",
			url: "assets/contact.php",
			data: "name=" + name + "&email=" + email + "&msg_subject=" + msg_subject + "&message=" + message,
			success : function(text){
				if (text === "success"){
					formSuccess();
				} else {
					formError();
					submitMSG(false,text);
				}
			}
		});
	}

	function formSuccess(){
		$("#contactForm")[0].reset();
		submitMSG(true, "Message Submitted!")
	}

	function formError(){
		$("#contactForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$(this).removeClass();
		});
	}

	function submitMSG(valid, msg){
		if(valid){
			var msgClasses = "h3 text-center tada animated text-success";
		} else {
			var msgClasses = "h3 text-center text-danger";
		}
		$("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
	}
	

})(jQuery);