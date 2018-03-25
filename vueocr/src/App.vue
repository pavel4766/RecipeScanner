<template>
    <div id="app">
      <ocr></ocr>
    </div>
</template>

<script>
    import ocr from  "./components/OCR"

    export default {
        name: 'App',
        components: {
            ocr
        }
    }


</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
