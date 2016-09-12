function loadQuestion(quiz_id) {

	// shuffle answers (pending)

	if(!$('#ld_quiz_' + current)[0]) {

		var quizFile = 'quiz/qct_' + quiz_id + '.json'; 	// json file to load

		$.getJSON(quizFile, function(data) {
			var htmlTemplate = '<p class="question">' + data.question + '</p>'; // show the question
			htmlTemplate += "<form action>"; 	// open the form

			// insert the options
			for (var i in data.options) {
				htmlTemplate += "<input type=\"radio\" name=\"options\" id=\"options\" class=\"option\" value=\"" + i + "\">" + data.options[i].option + "<br>"; }

			htmlTemplate += "</form>"; // close the form

			htmlTemplate += '<p class="instructions">' + data.instructions + '</p>'; // insert the instructions
			
			// create a slide and put the content inside
			var htmlContent = '<div id="ld_quiz_' +  current + '" class=\"quiz\">' + htmlTemplate + '<button onclick=\"validateAnswer(' + quiz_id + ')\" type=\"submit\" value=\"Submit\">Submit</button><p class=\"feedback\"></p>';
			$('#ld_slide_' + current + ' .single-choice').append(htmlContent);
			$('#ld_slide_' + current + ' .single-choice').animate();

			});

		// hide the advance button and the feedback field
		$('#ld_right_button').hide();
		$('#ld_slide_' + current + ' .feedback').hide();

	}
}

// validate answer

function validateAnswer(quiz_id)
{

	if ($('#ld_slide_' + current + ' :checked').val()) { // check that there is an answer

		var feedbackFile = 'quiz/qfb_' + quiz_id + '.json';

		$.getJSON(feedbackFile, function(data) {

			// get the options and the feedback fields
			var optionsList = $('#ld_slide_' + current + ' #options.option');
			var feedbackField = $('#ld_slide_' + current + ' .feedback');

			// get the selected choice
			var answer = $('#ld_slide_' + current + ' :checked').val();

			// show the feedback in the feedback field
			feedbackField[0].innerHTML = data[answer].feedback;
			feedbackField.show('slow');

			// if the answer is right, enable advance button and disable all options
			if(data[answer].right == true) {
				$('#ld_right_button').show('slow');
				for (var i = 0; i < optionsList.length; i++) {
					feedbackField.css('color', 'rgb(32, 197, 32)');
					optionsList[i].disabled = true;
				}
			}
		});
	}
	else {
		if($('#dialog-modal')[0] == null) {
			var dialogContent = '<div id="dialog-modal" title="Select a choice"><p>You must select an answer</p></div>';
			$('#ld_slider').append(dialogContent);
			$('#dialog-modal').effect('fade');
		}
		$('#dialog-modal').dialog({height: 140, modal: true, position: {my: "center", at: "center", of: "#ld_wrapper"}, draggable: false});
	}
}
