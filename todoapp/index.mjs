import pubsub from "./pubsub.mjs";
import store from "./store.mjs";

const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

pubsub.subscribe("save",async (a)=> {
    try {
        await store.save(a)
    } catch(e) {
        console.log(e)
    }
});

pubsub.subscribe("render",async ()=>{
    try {
        const items = await store.find();
        const rem = (parent) => {
            while(parent.firstChild) {
                parent.removeChild(parent.firstChild)
            }
        }
        rem(taskList);

        const build = (parent,data) => {
            const listItem = document.createElement('li');
            const taskTextSpan = document.createElement('span');
            const deleteButton = document.createElement('button');

            taskTextSpan.textContent = data;
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                const a = await store.findOne(data)
                await store.delete(a)
                pubsub.publish("render",null)
            });

            listItem.appendChild(taskTextSpan);
            listItem.appendChild(deleteButton);
            parent.appendChild(listItem);
        }

        items.map((i,n)=>{
            build(taskList,i)
        })

        taskInput.value = '';
        taskInput.focus();
    } catch(e) {
        console.log(e)
    }
});

addButton.addEventListener("click",()=>{
    const a = taskInput.value.trim();
    if(a!=='') {
        pubsub.publish("save",a)
        pubsub.publish("render",null)
    }
})