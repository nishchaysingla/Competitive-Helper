document.getElementById('leetcode').style.boxShadow = "0px 0px 60px -20px";

// URL: https://leetcode.com/graphql/
// query questionOfToday{activeDailyCodingChallengeQuestion{date link question {difficulty status title}}}

fetch("https://leetcode.com/graphql/?query=query questionOfToday{activeDailyCodingChallengeQuestion{date link question {difficulty status title}}}")
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        var dateElement = document.getElementById('date');
        var dailyConElement = document.getElementById('daily-con');

        if (dateElement && dailyConElement) {
            dateElement.innerHTML = data.data.activeDailyCodingChallengeQuestion.date;
            dailyConElement.innerHTML = `
                <a class="link-dec" target="_blank" href="https://leetcode.com${data.data.activeDailyCodingChallengeQuestion.link}">
                    ${data.data.activeDailyCodingChallengeQuestion.question.title}
                </a>
                <span class="difficulty ${data.data.activeDailyCodingChallengeQuestion.question.difficulty}">
                    ${data.data.activeDailyCodingChallengeQuestion.question.difficulty}
                </span>
                <span class="status">
                    ${(data.data.activeDailyCodingChallengeQuestion.question.status === "ac") ? "Solved" : "Unsolved"}
                </span>`;
        } else {
            console.error('One or more elements not found');
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
    });


document.getElementById('leetCodeRandom').addEventListener('mousedown', function() {
    this.innerHTML = '<img class="loader" src="../logos/loader.gif"></img>';
    if (!(
        document.getElementById('easy').checked ||
        document.getElementById('medium').checked ||
        document.getElementById('hard').checked
    )) {
        this.innerHTML = 'Go!';
    }
});


document.getElementById('leetCodeRandom').addEventListener('click', function() {
    if (!(
        document.getElementById('easy').checked ||
        document.getElementById('medium').checked ||
        document.getElementById('hard').checked
    )) {
        document.getElementById('easy').classList.toggle('invalidInp');
        document.getElementById('medium').classList.toggle('invalidInp');
        document.getElementById('hard').classList.toggle('invalidInp');
    } else {
        this.innerHTML = 'Loading...';
        leetCodeRandom();
    }
});


function leetCodeRandom() {
    var urls = [];

    function fetchAndProcess(difficulty) {
        return fetch(`https://leetcode.com/graphql/?query=query {problemsetQuestionList: questionList(categorySlug:"", limit:1 skip:0 filters:{difficulty:${difficulty}}) {total:totalNum}}`)
            .then(response => response.json())
            .then(data => {
                let total = data.data.problemsetQuestionList.total;
                return fetch(`https://leetcode.com/graphql/?query=query {problemsetQuestionList: questionList(categorySlug:"", limit:${total} skip:0 filters:{difficulty:${difficulty}}) {questions:data {titleSlug}}}`)
                    .then(response => response.json())
                    .then(data => {
                        data.data.problemsetQuestionList.questions.forEach(item => {
                            urls.push(`https://leetcode.com/problems/${item.titleSlug}/`);
                        });
                    });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    if (document.getElementById('easy').checked) {
        fetchAndProcess("EASY");
    }

    if (document.getElementById('medium').checked) {
        fetchAndProcess("MEDIUM");
    }

    if (document.getElementById('hard').checked) {
        fetchAndProcess("HARD");
    }

    Promise.all([
        document.getElementById('easy').checked ? fetchAndProcess("EASY") : Promise.resolve(),
        document.getElementById('medium').checked ? fetchAndProcess("MEDIUM") : Promise.resolve(),
        document.getElementById('hard').checked ? fetchAndProcess("HARD") : Promise.resolve(),
    ]).then(() => {
        if (urls.length > 0) {
            let randomIndex = Math.floor(Math.random() * urls.length);
            chrome.tabs.create({
                url: urls[randomIndex]
            });
        } else {
            console.error('No URLs fetched.');
        }
    });
}