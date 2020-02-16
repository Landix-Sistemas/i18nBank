/* const fruitBasket = {
  apple: 27,
  grape: 0,
  pear: 14
}

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const getNumFruit = fruit => {
  return sleep(1000).then(v => fruitBasket[fruit])
}

const fruitsToGet = ['apple', 'grape', 'pear']

const forLoop = async _ => {
  console.log('Start')

  for (let index = 0; index < fruitsToGet.length; index++) {
    const fruit = fruitsToGet[index]
    const numFruit = await getNumFruit(fruit)
    console.log(numFruit)
  }

  console.log('End')
} */
// console.log(forLoop)

const asyncIterable = {
  [Symbol.asyncIterator] () {
    return {
      i: 0,
      next () {
        if (this.i < 3) {
          return Promise.resolve({ value: this.i++, done: false });
        }

        return Promise.resolve({ done: true });
      }
    }
  }
};

(async function () {
  console.log(asyncIterable)
  for await (let num of asyncIterable) {
    console.log(num)
  }
})()

/*
const urls = [
  'https://jsonplaceholder.typicode.com/todos/1',
  'https://jsonplaceholder.typicode.com/todos/2',
  'https://jsonplaceholder.typicode.com/todos/3'
]

async function getTodos () {
  for (const [idx, url] of urls.entries()) {
    const todo = await fetch(url)
    console.log(`Received Todo ${idx + 1}:`, todo)
  }

  console.log('Finished!')
}

getTodos() */
