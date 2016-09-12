<!-- js/slider.js: load content, slide transitions -->

	// initialize variables
	
	var subsVisible = true;    	// set subtitle visible at the beginning
	var continousPlay = false; 		// for continous play, set true, otherwise set false
	var delayAfterAudio = 1000;		// for continous play
	var delayWithoutAudio = 5000;	// for continous play
	var sliderSpeed = 1000;		// time to change slide
	var current = 0;			// set current slide as 0
	var elements;				// number of slides
	var slideWidth;				// slide width as set in layout.css
	var defaultTemplate = "standard";  // set the default template

	// get the voiceover container
	var audioBoxId;

	function setContent()
	{
		// set events for buttons
		$('#prev_button').click(function() {
			slideContent('previous');
		});

		$('#next_button').click(function() {
			slideContent('next');
		});

		$('#subs_button').click(showhideSubtitle);

		$('#continous_button').click(function() {
			if (continousPlay) {
				continousPlay = false;
				$('#continous_button').css('opacity', '');
			}
			else {
				continousPlay = true;
				$('#continous_button').css('opacity', '1');
			}
		});

		// get the wrapper width
		var wrapperID = $('#ld_wrapper');
		slideWidth = parseInt(wrapperID.css('width'));

		// get the audio container;
		audioBoxId = $('#ld_voiceover');

		// count the number of slides
		elements = slides_content.length;

		// set the slider width to fit all the slides
		var totalSliderWidth = elements * slideWidth;
		var sliderDiv = $('#ld_slider');
		sliderDiv.css('width', totalSliderWidth + "px");

		// create the slides and set the content
		for (var count = 0; count < elements; count++) {

			// get the slide template
			if(slides_content[count].template) {
				var slideTemplate = slides_content[count].template;
			}
			else {
				var slideTemplate = defaultTemplate; // get the first template as the default template
			}

			// get the template elements
			var htmlTemplate = slide_templates[slideTemplate];

			// create a slide and put the template inside
			var htmlContent = '<div id="ld_slide_' +  count + '" class="slide"><div class="' + slideTemplate + '">' + htmlTemplate + '</div></div>';
			sliderDiv.append(htmlContent);

			// put the content in the template
			var slideDiv = $('#ld_slide_' + count);
			slideDiv.loadJSON(slides_content[count]);
			// slideDiv.load("content.json");

		}

		// set the slide width
		var slideClass = $('#ld_slider .slide');
		slideClass.css('width', slideWidth + "px");

		// disable advance button if it is a question, activate it if not
		if (slides_content[current].question == "1") {
			loadQuestion(slides_content[current].quizid);	
		}
		else {
			$('#ld_right_button').show();
		}

		// remove loader
		$('#ld_loading').hide();

		// show the slide number
		showSlideNumber();

		// set the subtitle text
		setSubtitle();

		// play audio or disable player
		playAudio();
	}

	// move the slides

	function slideContent(direction)
	{
		var currentAudio = $('#ld_audio_' + current); // get the audio file, if it exists

		// hide and pause the current audio
		if(currentAudio[0] != undefined) {
			currentAudio.off('ended'); // remove trigger for continous play
			currentAudio.hide();
			currentAudio[0].pause();
		}

		// move the slider to the left or right
		var currentSlide = $('#ld_slide_' + current);

		if (direction == "next" && current < elements - 1) {
			currentSlide.hide();
			// currentSlide.hide(1000);
			current = current + 1;
			currentSlide = $('#ld_slide_' + current);
			// $('#ld_slider').animate({left:'-=' + slideWidth}, sliderSpeed);
			currentSlide.show();
			showSlideNumber(); // show the slide number
			setSubtitle(); 		// set the subtitle text
			playAudio(); 		// play audio	
		}
		else if (direction == "previous" && current > 0) {
			currentSlide.hide();
			// deactivate continous play
			continousPlay = false;
			$('#continous_button').css('opacity', '');
			current = current - 1;
			currentSlide = $('#ld_slide_' + current);
			currentSlide.show(); 
			//$('#ld_slider').animate((left:'+=' + slideWidth}, sliderSpeed);
			showSlideNumber();  // show the slide number
			setSubtitle(); 		// set the subtitle text
			playAudio(); 		// play audio
		}

		// disable advance button if it is a question and load question and stop advance trigger
		if (slides_content[current].question == "1") {
			loadQuestion(slides_content[current].quizid);
		}
		else {
			$('#ld_right_button').show();
		}
	}

	function setSubtitle()
	{
		// get the subtitle container
		var subtitleboxId = $('#ld_subtitle_box')[0];
		var subtitleContent = slides_content[current].subtitle;

		// put the subtitle in the container		
		if (subtitleContent) {
			subtitleboxId.innerHTML = '<p>' + subtitleContent + '</p>';
		}
		else {
			subtitleboxId.innerHTML = "";
		}
	}

	function playAudio()
	{
		// get the audio file, if it exists
		var audioSrc = slides_content[current].audio;

		// put the audio in the container and hide it
		if (audioSrc) {
			var audioHTML = '<audio id="ld_audio_' + current + '" class="ld_audio">';
			audioHTML += '<source src="audio/' + audioSrc + '.ogg" type="audio/ogg" autobuffer>'; // supported in Chrome, Firefox and Opera
			audioHTML += '<source src="audio/' + audioSrc + '.mp3" type="audio/mp3" autobuffer">'; // supported in Chrome, IE and Safari
			audioHTML += '<p>Your browser does not support this audio content</p>';
			audioHTML += '</audio>';
			audioBoxId.html(audioHTML);
		}
			
		// get the current audio, if exists
		var currentAudio = $('#ld_audio_' + current);

		// show and play the audio file
		if(currentAudio[0] != undefined) {
			currentAudio.show();
			currentAudio.on('ended', function() {
				slideContinous(delayAfterAudio);
			}); // set trigger for continous play
			currentAudio[0].load(); 
			currentAudio[0].play();
		}
		else {
			if (slides_content[current].question != "1") {
				slideContinous(delayWithoutAudio);
			}
		}
	}

	// show slide number

	function showSlideNumber() {
		var numberBoxId = $('#ld_player_left');
		numberBoxId.html(current + 1);
	}

	// show and hide subtitle
	
	function showhideSubtitle() 
	{
	    var subtitleBoxId = $('#ld_subtitle_box');
	    
	    if (subsVisible) {
               	// set them invisible
               	subsVisible = false;
               	subtitleBoxId.css('opacity', '0');
        }
	    else {
			// set them visible
	        subsVisible = true;
        	subtitleBoxId.css('opacity', '');
	    }

		// change subtitles status
	        
	}

	// go continously forward		

	function slideContinous(delay)
	{
		if (continousPlay)
		{
			setTimeout(function(){slideContent('next')}, delay);
		}
	}

	// stop continous playing
