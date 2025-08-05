function secureRandomIndex(max) {
    const array = new Uint32Array(1);
    let limit = Math.floor(0xFFFFFFFF / max) * max;
    do {
        crypto.getRandomValues(array);
    } while (array[0] >= limit);
    return array[0] % max;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = secureRandomIndex(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function generate() {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    const specials = "!@#$%^&*()_+-={}[];<>:";

    const length = parseInt(document.querySelector('input[type="range"]').value);
    const selectedSets = [];

    if (document.getElementById("lowercaseCb").checked) selectedSets.push(lowercase);
    if (document.getElementById("uppercaseCb").checked) selectedSets.push(uppercase);
    if (document.getElementById("digitsCb").checked) selectedSets.push(digits);
    if (document.getElementById("specialsCb").checked) selectedSets.push(specials);

    if (length < selectedSets.length || selectedSets.length === 0) return;

    const allChars = selectedSets.join('');
    let password = [];

    // Ensure one character from each set
    for (let set of selectedSets) {
        password.push(set.charAt(secureRandomIndex(set.length)));
    }

    // Fill remaining characters
    while (password.length < length) {
        password.push(allChars.charAt(secureRandomIndex(allChars.length)));
    }

    // Shuffle for randomness
    password = shuffle(password);

    document.querySelector('input[type="text"]').value = password.join('');
}

[
    ...document.querySelectorAll('input[type="checkbox"], button.generate')
].forEach((elem) => {
    elem.addEventListener("click", generate);
});

document.querySelector('input[type="range"]').addEventListener("input", (e) => {
    document.querySelector("div.range span").innerHTML = e.target.value;
    generate();
});

document.querySelector("div.password button").addEventListener("click", () => {
    const pass = document.querySelector('input[type="text"]').value;
    navigator.clipboard.writeText(pass).then(() => {
        document.querySelector("div.password button").innerHTML = "copied!";
        setTimeout(() => {
            document.querySelector("div.password button").innerHTML = "copy";
        }, 1000);
    });
});

generate();

