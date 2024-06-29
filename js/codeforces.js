document.getElementById('codeforces').style.boxShadow = "0px 0px 50px -20px";

const arr = ['binary search','brute force','data structures','combinatorics','dfs and similar','dsu','graph matchings','greedy','math','graphs','shortest paths','implementation','constructive algorithms','dp','sortings','hashing','strings','divide and conquer','trees','geometry','matrices','number theory','bitmasks','two pointers','fft','interactive','2-sat','flows','probabilities','games','string suffix structures','meet-in-the-middle','schedules','ternary search','*special','chinese remainder theorem','expression parsing']


let counter = 0;
const tagsContainer = document.getElementById('tags');

arr.forEach((tag, index) => {
    counter++;
    const label = document.createElement('label');
    label.setAttribute('for', counter);
    label.classList.add('tagLabel');
    label.textContent = tag;

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', 'tag');
    input.setAttribute('id', counter);
    input.setAttribute('value', tag);
    input.classList.add('tagCheckbox');

    tagsContainer.appendChild(label);
    tagsContainer.appendChild(input);
});

const tagLabels = document.querySelectorAll('.tagLabel');
tagLabels.forEach(label => {
    label.addEventListener('click', (event) => {
        event.currentTarget.classList.toggle('selected');
    });
});

let check = false;

document.getElementById('codeForcesRandom').addEventListener('mousedown', () => {
    const codeForcesRandomElem = document.getElementById('codeForcesRandom');
    codeForcesRandomElem.innerHTML = '<img class="loader" src="../logos/loader.gif"></img>';

    check = Array.from(document.querySelectorAll('.tagCheckbox')).some(input => input.checked);

    if (!check) {
        codeForcesRandomElem.innerHTML = 'Go!';
    }
});

document.getElementById('codeForcesRandom').addEventListener('click', () => {
    if (check) {
        codeForcesRandom();
    } else {
        document.getElementById('error').innerHTML = 'Select at least 1 tag';
    }
});

function codeForcesRandom() {
    let tagArr = "";
    Array.from(document.querySelectorAll('.tagCheckbox')).forEach((input, index) => {
        if (input.checked) {
            tagArr += `;${arr[index]}`;
        }
    });

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://codeforces.com/api/problemset.problems?tags=${tagArr}`);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const problems = data.result.problems;

            const length = problems.length;
            if (length === 0) {
                document.getElementById('error').innerHTML = 'No problems found within the given parameters';
                document.getElementById('codeForcesRandom').innerHTML = 'Go!';
                return;
            }

            const randomIndex = Math.floor(Math.random() * length);
            const problem = problems[randomIndex];

            document.getElementById('codeForcesRandom').innerHTML = 'Loading...';
            chrome.tabs.create({
                url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`
            });
        }
    };
    xhr.send();
}