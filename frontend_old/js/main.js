$(window).on('load', function() {
	var window_width = $(window).width();
	var movie_info;// API
	var api_base = 'http://localhost:5000/api/';
	
	$(document).on('click', '.user-img', function () {
		$(this).parent().toggleClass('open');
	});
	
	// A troca das informações deve ocorrer aqui
	$(document).on('click', '.slick-slide[data-id]', function() {
		$('.slick-slide').removeClass('selected');
		$(this).addClass('selected');
		changeMovieInfo($(this).attr('data-id'));
	});
	
	// Adicionar filme modal
	$(document).on('click', '.add-movie', function () {
		$('.modal .modal-body').html('<div class="form-group"><label>Título:</label><input type="text" class="form-control titulo"></div><div class="form-group"><label>Arquivo:</label><input type="text" class="form-control arquivo"></div><div class="form-group"><label>Diretor:</label><input type="text" class="form-control diretor"></div><div class="form-group"><label>Categoria:</label><input type="text" class="form-control categoria"></div><div class="form-group"><label>Descrição:</label><textarea class="form-control descricao" rows="5"></textarea></div><div class="form-group"><label>Atores:</label><textarea class="form-control atores" rows="5"></textarea><p class="form-text">Separe os atores por ,</p></div>');
		$('.modal').addClass('add').modal();
	});
	
	// Adicionar filme modal
	$(document).on('click', '.filter-movies', function () {
		$('.modal').removeClass('note').removeClass('comment').removeClass('add');
		$('.modal .modal-body').html('<div class="form-group"><div class="label">Filtro:</div><select class="form-control filter"><option value="titulo">Título</option><option value="categoria">Categoria</option><option value="diretor">Diretor</option><option value="descricao">Descrição</option><option value="atores">Atores</option></select></div><div class="form-group"><input type="text" class="form-control value"></div>');
		$('.modal').addClass('filter').modal();
	});
	
	// Adicionar filme botão
	$(document).on('click', '.modal.add .btn-primary', function () {
		$('.modal').removeClass('note').removeClass('comment').removeClass('filter');
		var titulo = $('.modal.add .titulo').val();
		var diretor = $('.modal.add .diretor').val();
		var categoria = $('.modal.add .categoria').val();
		var descricao = $('.modal.add .descricao').val();
		var atores = $('.modal.add .atores').val().split(',');
		var arquivo = $('.modal.add .arquivo').val();
		atores = atores.map(function(ator){return ator.trim()});
		var data = {
			titulo: titulo,
			diretor: diretor,
			categoria: categoria,
			descricao: descricao,
			atores: atores,
			arquivo: arquivo
		}
		$.ajax({
			contentType: 'application/json',
			type: 'post',
			data: JSON.stringify(data),
			url: api_base+'geral/',
			success: function (request) {
				$('.message').html('<div class="alert alert-success alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Sucesso!</strong> Filme adicionado</div>');
				$('.modal').modal('toggle');
				$('.movies').remove();
				$('<div class="movies"></div>').insertAfter('.jumbotron')
				requestMovies();
			},
			error: function (error) {
				console.log(error);
			}
		});
	});
	
	// Filtrar filmes
	$(document).on('click', '.modal.filter .btn-primary', function () {
		var data= {};
		var filter = $('.modal.filter .filter').val();
		var value = $('.modal.filter .value').val();
		data[filter] = value;
		$.ajax({
			contentType: 'application/json',
			type: 'post',
			url: api_base+'filme/filtro',
			data: JSON.stringify(data),
			success: function (request) {
				$('.movies').remove();
				$('<div class="movies"></div>').insertAfter('.jumbotron');
				$('.movies').append('<div class="slide add-movie"><div class="thumbnail"><img src="img/plus.png"></div></div>')
				for(var i = 0; i< request.filmes.length; i++) {
					if(i === 0) {
						first_id = request.filmes[i].id;
					}
					$('.movies').append('<div data-id="'+request.filmes[i].id+'" class="slide"><div class="thumbnail"><img src="http://10.100.0.56:5000/'+request.filmes[i].arquivo+'" alt="'+request.filmes[i].titulo+'"><div class="caption"><p>'+request.filmes[i].titulo+'</p></div></div></div>');
				}
				changeMovieInfo(first_id);

				// Inicia o carousel
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
				if($('.slick-slide.selected.length') != 1) {
					$('.slick-slide[data-id]').eq(0).addClass('selected');
				}
				fixLayout();
				$('.message').html('<div class="alert alert-success alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Sucesso!</strong> Os filmes foram filtrados!</div>');
				$('.modal').modal('toggle');
			}
		});
	});
	
	// Limpar filtro
	$(document).on('click', '.clean-filter', function () {
		$('.movies').remove();
		$('<div class="movies"></div>').insertAfter('.jumbotron');
		requestMovies();
	});
	
	// Botão de assistir
	$(document).on('click', '.movie-actions .btn-primary', function () {
		var id = $('.slick-slide.selected').attr('data-id');
		$.ajax({
			type: 'put',
			url: api_base+'filme/'+id,
			success: function (request) {
				getRecentsAndRecommended();
			}
		});
		$('.message').html('<div class="alert alert-success alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Sucesso!</strong> Seu filme esta sendo baixado!</div>');
	});
	
	//Adicionar comentario
	$(document).on('click', '.modal.comment .btn-primary', function () {
		var id = $('.slick-slide.selected').attr('data-id');
		var name = $('.modal.comment .name').val();
		var comment = $('.modal.comment .comment').val();
		var data = {
			nome: name,
			comentario: comment
		}
		$.ajax({
			dataType: 'json',
			contentType: 'application/json',
			type: 'post',
			data: JSON.stringify(data),
			url: api_base+'filme/'+id+'/comentarios',
			success: function (request) {
				$('.all-comments').prepend('<div class="comment"><hr><h4>'+data.nome+'</h4><p>'+data.comentario+'</p></div>');
				$('.message').html('<div class="alert alert-success alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Sucesso!</strong> Comentário adicionado</div>');
				changeMovieInfo(id);
			},
			error: function (error) {
				console.log(error);
			}
		});
	});
	
	//Adicionar nota
	$(document).on('click', '.modal.note .btn-primary', function () {
		var id = $('.slick-slide.selected').attr('data-id');
		var nota = $('.modal.note .note').val();
		var data = {
			nome: nota
		}
		$.ajax({
			dataType: 'json',
			contentType: 'application/json',
			type: 'post',
			data: JSON.stringify(data),
			url: api_base+'filme/'+id+'/avaliacao',
			success: function (request) {
				changeMovieInfo(id);
				$('.message').html('<div class="alert alert-success alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Sucesso!</strong> Nota adicionada</div>');
				$('.modal').modal('toggle');
				getRecentsAndRecommended();
			},
			error: function (error) {
				console.log(error);
			}
		});
	});
	
	// Apagar filme
	$(document).on('click', '.movie-actions .btn-danger', function () {
		var id = $('.slick-slide.selected').attr('data-id');
		$.ajax({
			dataType: 'json',
			contentType: 'application/json',
			type: 'delete',
			url: api_base+'geral/'+id,
			success: function (request) {
				$('.movies').remove();
				$('<div class="movies"></div>').insertAfter('.jumbotron')
				requestMovies();
			},
			error: function (error) {
				console.log(error);
			}
		});
	});
	
	// Preencher modal
	$('.modal').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget);
		if(button.data('type') == 'comment') {
			$(this).removeClass('note').removeClass('add').removeClass('filter');
			$(this).addClass('comment');
			$(this).find('.modal-body').html('<div class="form-group"><label>Nome:</label><input type="text" class="form-control name"></div><div class="form-group"><label>Comentário:</label><input type="text" class="form-control comment"></div><h2>Comentários</h2><div class="all-comments"></div>');
			if(movie_info.comentarios) {
				for(i=0; i<movie_info.comentarios.length; i++) {
					$('.modal .all-comments').append('<div class="comment"><hr><h4>'+movie_info.comentarios[i].nome+'</h4><p>'+movie_info.comentarios[i].comentario+'</p></div>');
				}
			}
		} else if (button.data('type') == 'note') {
			$(this).removeClass('comment').removeClass('add').removeClass('filter');;
			$(this).addClass('note');
			$(this).find('.modal-body').html('<div class="form-group"><label>Nota:</label><select class="form-control note"><option value="bom">Bom</option><option value="medio">Médio</option><option value="ruim">Ruim</option></select></div>');
		}
	})

	// Deixa o layout melhor
	function jumbotronSize () {
		var moviesHeight = Math.round($('.movies').outerHeight());
		moviesHeight = 'calc(100vh - ' +moviesHeight+ 'px)';
		$('.jumbotron [class*="col-"]').each(function() {
			$(this).css('height', moviesHeight);
		});
	}

	function fixLayout () {
		window_width = $(window).width();
		if(window_width > 768) {
			$('body').removeAttr('style');
			jumbotronSize();
		} else {
			var moviesHeight = Math.round($('.movies').outerHeight());
			$('body').css('padding-bottom', moviesHeight);
			$('.jumbotron [class*="col-"]').each(function() {
				$(this).removeAttr('style');
			});
		}
	}

	// Redimensionamento
	$(window).on('resize', function () {
		fixLayout();
	});

	function changeMovieInfo (id) {
		$.ajax({
			url: api_base+'geral/'+id,
			success: function (request) {
				movie_info = request.info[0];
				$('.movie-title').text(movie_info.titulo);
				$('.movie-note').text('bom: '+parseInt(movie_info.avaliacao.bom)+' médio: '+parseInt(movie_info.avaliacao.medio)+' ruim: '+parseInt(movie_info.avaliacao.ruim));
				$('.movie-director').text(movie_info.diretor);
				$('.movie-description').text(movie_info.descricao);
				$('.movie-categorie').text(movie_info.categoria);
				$('.movie-bg').attr('style', 'background-image: url(http://10.100.0.56:5000/'+movie_info.arquivo+')');
				var actors = '';
				if(movie_info.atores) {
					for(var i=0; i < movie_info.atores.length; i++) {
						actors += movie_info.atores[i];
						if(i+1 < movie_info.atores.length) {
							actors += ' - ';
						}
					}
				}
				$('.movie-actors').text(actors);
			},
			error: function (error) {
				console.log(error);
			}
		});
	}

	function requestMovies() {
		$.ajax({
			url: api_base+'geral/',
			success: function (request) {
				var first_id;
				$('.movies').append('<div class="slide add-movie"><div class="thumbnail"><img src="img/plus.png"></div></div>')
				for(var i = 0; i< request.filmes.length; i++) {
					if(i === 0) {
						first_id = request.filmes[i].id;
					}
					$('.movies').append('<div data-id="'+request.filmes[i].id+'" class="slide"><div class="thumbnail"><img src="http://10.100.0.56:5000/'+request.filmes[i].arquivo+'" alt="'+request.filmes[i].titulo+'"><div class="caption"><p>'+request.filmes[i].titulo+'</p></div></div></div>');
				}
				changeMovieInfo(first_id);

				// Inicia o carousel
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
				if($('.slick-slide.selected.length') != 1) {
					$('.slick-slide[data-id]').eq(0).addClass('selected');
				}
				fixLayout();
			},
			error: function (error) {
				console.log('erro', error);
			}
		});
	}
	requestMovies();
	
	function getRecentsAndRecommended() {
		$.ajax({
			url: api_base+'filme/recentes',
			success: function (request) {
				var text = '';
				for(var i = 0; i< request.filmes.length; i++) {
					text += '<li>' + request.filmes[i].titulo + '</li>';
				}
				$('.recents-content').html(text);
			}
		});
		$.ajax({
			url: api_base+'filme/recomendados',
			success: function (request) {
				var text = '';
				for(var i = 0; i< request.filmes.length; i++) {
					text += '<li>' + request.filmes[i].titulo + '</li>';
				}
				$('.recommended-content').html(text);
			}
		});
	}
	getRecentsAndRecommended();
	
});