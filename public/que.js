const ques=document.querySelectorAll('.aman1');
    for(let i=0; i<ques.length; i++){
        ques[i].addEventListener('click', function() {
        const temp = document.querySelectorAll('.aman11');
        questions=temp[i];
        if (questions.style.display === 'none' || questions.style.display === '') {
            questions.style.display = 'block';
        } else {
            questions.style.display = 'none';
        }
    });
}