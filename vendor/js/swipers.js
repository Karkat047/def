document.addEventListener('DOMContentLoaded', function() {
	var homeSliderFirstSwiper = new Swiper( ".home_slider_first_swiper", {
		slidesPerView: 1,
		spaceBetween: 80,
		pagination: {
			el: ".home_slider_first_swiper_pagination",
			clickable: true,
		},
		keyboard: true,
	});
	
	var riskSwiper = new Swiper( ".risk_swiper", {
		slidesPerView: 1,
		spaceBetween: 80,
		loop: true,
		navigation: {
			nextEl: ".risk_swiper_right_button",
			prevEl: ".risk_swiper_left_button",
		},
		pagination: {
			el: ".risk_swiper_pagination",
			clickable: true,
		},
		keyboard: true,
	});
	
	var schemeSwiper = new Swiper(".scheme_swiper", {
		slidesPerView: 1,
		spaceBetween: 80,
		navigation: {
			nextEl: ".scheme_swiper_right_button",
			prevEl: ".scheme_swiper_left_button",
		},
		pagination: {
			el: ".scheme_swiper_pagination",
			clickable: true,
		},
		keyboard: true,
		breakpoints: {
			0: {
				spaceBetween: 0,
			},
			1024: {
				spaceBetween: 80,
			}
		},
		on: {
			init: function () {
				this.update();
			},
		},
	});
	
	window.addEventListener('resize', function() {
		setTimeout(function() {
			schemeSwiper.update();
		}, 100);
	});
	
	document.querySelectorAll( '.scheme_swiper_step_buttons [data-slide]' ).forEach( btn => {
		btn.addEventListener( 'click', ( e ) => {
			const index = parseInt( e.currentTarget.dataset.slide, 10 );
			schemeSwiper.slideTo( index );
		} );
	});
	
	function updateActiveStep() {
		const activeIndex = schemeSwiper.realIndex || schemeSwiper.activeIndex;
		
		document.querySelectorAll( '.scheme_swiper_step_buttons [data-slide]' ).forEach( btn => {
			btn.classList.remove( 'scheme_swiper_step_active' );
		} );
		
		const activeBtn = document.querySelector( `.scheme_swiper_step_buttons [data-slide="${activeIndex}"]` );
		if ( activeBtn ) {
			activeBtn.classList.add( 'scheme_swiper_step_active' );
			
			if ( window.matchMedia( '(max-width: 1023px)' ).matches ) {
				scrollToCenter( activeBtn, activeIndex );
				
				const buttonsContainer = activeBtn.parentElement;
				const totalButtons = document.querySelectorAll( '.scheme_swiper_step_buttons [data-slide]' ).length;
				
				buttonsContainer.classList.remove(
					'scheme_swiper_step_buttons--first-active',
					'scheme_swiper_step_buttons--last-active',
					'scheme_swiper_step_buttons--middle-active'
				);
				
				if ( activeIndex === 0 ) {
					buttonsContainer.classList.add( 'scheme_swiper_step_buttons--first-active' );
				} else if ( activeIndex === totalButtons - 1 ) {
					buttonsContainer.classList.add( 'scheme_swiper_step_buttons--last-active' );
				} else {
					buttonsContainer.classList.add( 'scheme_swiper_step_buttons--middle-active' );
				}
			}
		}
	}
	
	function scrollToCenter( element, index ) {
		const container = element.parentElement;
		const totalButtons = document.querySelectorAll( '.scheme_swiper_step_buttons [data-slide]' ).length;
		
		if ( index === 0 ) {
			container.scrollTo( {
				left: 0,
				behavior: 'smooth'
			} );
		} else if ( index === totalButtons - 1 ) {
			container.scrollTo( {
				left: container.scrollWidth - container.offsetWidth,
				behavior: 'smooth'
			} );
		} else {
			element.scrollIntoView( {
				behavior: 'smooth',
				block: 'nearest',
				inline: 'center'
			} );
		}
	}
	
	schemeSwiper.on( 'slideChange', updateActiveStep );
	updateActiveStep();
	
	var casesItemSwiper = new Swiper( ".cases_item_swiper", {
		slidesPerView: "auto",
		spaceBetween: 14,
		navigation: {
			nextEl: ".cases_swiper_right_button",
			prevEl: ".cases_swiper_left_button",
		},
		pagination: {
			el: ".cases_swiper_pagination",
			clickable: true,
		},
		breakpoints: {
			1024: {
				spaceBetween: 80,
			}
		},
		keyboard: true,
	});
	
	var teamSwiper = new Swiper( ".team_swiper", {
		slidesPerView: "auto",
		spaceBetween: 40,
		loop: true,
		breakpoints: {
			1024: {
				slidesPerView: 3,
			}
		},
		navigation: {
			nextEl: ".team_swiper_right_button",
			prevEl: ".team_swiper_left_button",
		},
		keyboard: true,
	});

	
	const shortVideosSwiper = new Swiper( '.short_videos_swiper', {
		slidesPerView: "auto",
		spaceBetween: 80,
		loop: true,
		centeredSlides: true,
		navigation: {
			nextEl: '.short_video_swiper_right_button',
			prevEl: '.short_video_swiper_left_button',
		},
		
		on: {
			init: function () {
				this.update();
				this.slideTo( 2 );
			},
		},
		breakpoints: {
			1024: {
				slidesPerView: 5,
				spaceBetween: 34,
				centeredSlides: true
			}
		}
	});

	document.addEventListener( 'click', function ( e ) {
		const slide = e.target.closest( '.short-video-slide' );
		if ( !slide ) return;
		
		const slides = Array.from( document.querySelectorAll( '.short-video-slide' ) );
		const index = slides.indexOf( slide );
		
		if ( index !== -1 ) {
			shortVideosSwiper.slideTo( index );
		}
		
		if ( slide.classList.contains( 'swiper-slide-active' ) ) {
		}
	});
	
	var blogArticleSwiper = new Swiper( ".blog_article_swiper", {
		slidesPerView: "auto",
		spaceBetween: 20,
		loop: true,
		navigation: {
			nextEl: ".blog_articles_swiper_right_button",
			prevEl: ".blog_articles_swiper_left_button",
		},
		pagination: {
			el: ".blog_articles_pagination",
			clickable: true,
		},
		breakpoints: {
			1024: {
				slidesPerView: 4,
				spaceBetween: 40,
			}
		},
		keyboard: true,
	});
	
	var reviewsMainSwiper = new Swiper( ".reviews_main_swiper", {
		slidesPerView: 2,
		spaceBetween: 40,
		loop: true,
		navigation: {
			nextEl: ".reviews_main_swiper_right_button",
			prevEl: ".reviews_main_swiper_left_button",
		},
		keyboard: true,
	});
	
	var articlesSwiper = new Swiper( ".articles_swiper", {
		slidesPerView: "auto",
		spaceBetween: 40,
		pagination: {
			el: ".articles_swiper_pagination",
			clickable: true,
		},
		keyboard: true,
	});
})