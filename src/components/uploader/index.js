import Uploader from './src/uploader.vue';

Uploader.install = (Vue) => {
    Vue.component(Uploader.name, Uploader);
};

export default Uploader;
