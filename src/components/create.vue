<template>
    <section>
        <div class="button-back">
            <a v-bind:href="'#/'"><div class="button-arrow-back light-color"><</div></a>
            <div v-bind:href="'#/'"><a v-bind:href="'#/'" class="button light-color">Вернуться к списку</a></div>
        </div>
        <div class="add-event">
            <div class="card_head card_footer"><a>Создание мероприятия</a></div>
            <label class="card_head card_footer" for="title_input">Заголовок:</label>
            <input v-model="form['title']" id="title_input" class="card_local" placeholder="Placeholder...">
            <label class="card_head card_footer" for="text_input">Описание:</label>
            <textarea v-model="form['description']" id="text_input" class="card_local"
                      placeholder="Placeholder..."></textarea>
            <label class="card_head card_footer" for="dete_input">Дата:</label>
            <input v-model="form['dete']" id="dete_input" class="card_local" placeholder="01.01.1970">
            <div class=" add-button">
            <button class="button-right" type="button" @click="getTopic">Send</button>
        </div>
        </div>

    </section>

</template>

<script>
    import axios from 'axios'
    export default {
        name: "create",
        data() {
            return {
                form: {} // create an object to hold all form values
            }
        },
        methods: {
            getTopic() {
                let dateStr = this.form['dete']
                let parts = dateStr.split(".")
                let dete = new Date(parts[2], parts[1] -1, parts[0], 4 ).toISOString()
                let body={
                    "dete":dete,
                    "title":this.form['title'],
                    "description":this.form['description']
                };
                console.log('body',body);

                // const str = JSON.stringify(body);
                axios.post('http://5db050f78087400014d37dc5.mockapi.io/api/users/1/events', body)
                    .then((response) => {
                        alert('success')
                        location.assign('#/')
                        console.log(response);
                    })
                    .catch((error) => {
                        alert('error')
                        console.log(error);
                    });
            }
        }
    }
</script>

<style scoped>

</style>