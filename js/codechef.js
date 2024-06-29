document.getElementById('codechef').style.boxShadow = "0px 0px 50px -20px";

document.getElementById('codeChefRandom').addEventListener('mousedown', function() {
    var codeChefRandomElem = document.getElementById('codeChefRandom');
    codeChefRandomElem.innerHTML = '<img class="loader" src="../logos/loader.gif"></img>';
    
    var beginValue = document.getElementById('begin').value.trim();
    var endValue = document.getElementById('end').value.trim();
    
    if (beginValue === '' || endValue === '') {
        codeChefRandomElem.innerHTML = 'Go!';
    }
});

document.getElementById('codeChefRandom').addEventListener('click', function() {
    var codeChefRandomElem = document.getElementById('codeChefRandom');
    var beginElem = document.getElementById('begin');
    var endElem = document.getElementById('end');
    
    var beginValue = beginElem.value.trim();
    var endValue = endElem.value.trim();
    
    if (beginValue === '' || endValue === '') {
        codeChefRandomElem.innerHTML = 'Go!';
        beginElem.classList.toggle('invalidInp');
        endElem.classList.toggle('invalidInp');
    } else {
        codeChefRandom();
    }
});

var counter = 0;
var timer;

function increment() {
    counter++;
    console.log(counter);
    if (counter > 5) {
        var errorElem = document.getElementById('error');
        errorElem.innerHTML += '<p>The more the difference between begin rating and end rating, the more time it can take to navigate to a random problem. Be patient.</p>';
        clearInterval(timer);
        counter = 0;
    }
}

function codeChefRandom() {
    counter = 0;
    timer = setInterval(increment, 1000);

    var begin = document.getElementById('begin').value.trim();
    var end = document.getElementById('end').value.trim();

    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://www.codechef.com/api/list/problems?limit=1&start_rating=${begin}&end_rating=${end}`);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var count = data.count;

            if (count > 0) {
                var xhr2 = new XMLHttpRequest();
                xhr2.open('GET', `https://www.codechef.com/api/list/problems?limit=${count}&start_rating=${begin}&end_rating=${end}`);
                xhr2.onload = function() {
                    if (xhr2.status === 200) {
                        var data2 = JSON.parse(xhr2.responseText);
                        console.log(data2);
                        document.getElementById('codeChefRandom').innerHTML = 'Loading...';
                        chrome.tabs.create({ url: `https://www.codechef.com/problems/${data2.data[Math.floor(Math.random() * count)].code}` });
                        clearInterval(timer);
                    } else {
                        document.getElementById('error').innerHTML = 'No problems found within the given parameters';
                        document.getElementById('codeChefRandom').innerHTML = 'Go!';
                    }
                };
                xhr2.send();
            } else {
                document.getElementById('error').innerHTML = 'No problems found within the given parameters';
                document.getElementById('codeChefRandom').innerHTML = 'Go!';
            }
        }
    };
    xhr.send();
}
