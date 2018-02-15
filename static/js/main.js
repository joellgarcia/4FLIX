(function() {
	
	var windowWidth = $(window).width();
	
	// Faz o carousel
	$('.movies').slick({
			arrows: false,
			dots: true,
			infinite: false,
			speed: 300,
			slidesToShow: 8,
			slidesToScroll: 8,
			responsive: [
				{
					breakpoint: 1280,
					settings: {
						slidesToShow: 7,
						slidesToScroll: 7
					}
				},
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 6,
						slidesToScroll: 6
					}
				},
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 5,
						slidesToScroll: 5
					}
				},
				{
					breakpoint: 600,
					settings: {
						slidesToShow: 5,
						slidesToScroll: 5
					}
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3
					}
				}
			]
		});
		
		// Adiciona efeito de clique ao iniciar
		$('.slick-slide:first-child').addClass('selected');
		
		// A troca das informações deve ocorrer aqui
		$('.slick-slide').on('click', function() {
			$('.slick-slide').removeClass('selected');
			$(this).addClass('selected');
		})
		
		//Deixa o layout melhor
		function jumbotronSize () {
			var moviesHeight = Math.round($('.movies').height());
			moviesHeight = 'calc(100vh - ' +moviesHeight+ 'px)';
			$('.jumbotron [class*="col-"]').each(function() {
				$(this).css('height', moviesHeight);
			});
		}
		if(windowWidth > 768) {
			$('body').removeAttr('style');
			jumbotronSize();
		} else {
			var moviesHeight = Math.round($('.movies').height());
			$('body').css('padding-bottom', moviesHeight);
			$('.jumbotron [class*="col-"]').each(function() {
				$(this).removeAttr('style');
			});
		}
		
		$(window).on('resize', function () {
			windowWidth = $(window).width()
			if(windowWidth > 768) {
				$('body').removeAttr('style');
				jumbotronSize();
			} else {
				var moviesHeight = Math.round($('.movies').height());
				$('body').css('padding-bottom', moviesHeight);
				$('.jumbotron [class*="col-"]').each(function() {
					$(this).removeAttr('style');
				});
			}
		});
})();