import Event from "./event/event.mjs";
import pubsub from "./pubsub/pubsub.mjs";
import Box from "./tools/selection/box2.mjs";
import Renderer from "./renderer/renderer.mjs";
import Layers from "./layer/layer.mjs";

const { createApp, ref, onMounted, reactive } = Vue;
const { createVuetify } = Vuetify;

const vuetify = createVuetify()

const app = createApp({
    setup() {
        //data
        const canvas = ref(null),
              layers = Layers.get(),
              listLayers = layers.getLayers();
        let isboxSelected = false;
        //classes that use canvas after dom is mounted
        let event, box, renderer;
        //onmount dom
        onMounted(()=>{
            const cnvs = canvas.value;
            renderer = new Renderer(cnvs)
            event = new Event(cnvs).listen();
            box = Box.get().setCanvas(cnvs).listen();
        });

        //event listeners
        pubsub.subscribe("drawingbox",(dim)=>{
            layers.add("selection",{
                blendingMode:"normal"
            },dim);
            renderer.render()
        })

        //methods
        const boxActivate = (e) => {
            box.setBoxSelection(e);
            pubsub.publish("boxselected",null)
        }

        return {
            canvas,
            isboxSelected,
            listLayers,
            //methods
            boxActivate
        }
    }
})

app.use(vuetify).mount('#app')