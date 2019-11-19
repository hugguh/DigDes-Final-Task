<template>
    <section>
        <div class="center" v-if="errored">
            <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
        </div>
        <div class="center" v-else>
            <div class="button-back">
                <a v-bind:href="'#/'"><div class="button-arrow-back light-color"><</div></a>
                <div><a v-bind:href="'#/'" class="button light-color" >Вернуться к списку</a></div>
            </div>
            <div v-if="loading">Loading...</div>
            <div v-else class="card">
                <div class="card_local">
                    <div class="card_header">
                        <a class="card_head">{{ info.title }}</a>
                        <a class="light-color">Дата публикации: {{info.date_read}}</a>
                    </div>
                    <div class="card_body">
                        <p>{{ info.description }}</p>
                    </div>
                </div>
            </div>
        </div>
        <label for="comments" class="card card_head">Комментарии:</label>
        <div id="comments" class="card" v-for="art in comments">
            <div class="card_local comment" >
                <div class="card_header">
                    <div>
                        <img class="avatar" :src="art.avatar">
                        <a class="light-color">{{ art.name }}</a>
                    </div>
                    <a class="light-color">{{ art.date }}</a>
                </div>
                <div class="card_body">
                    <p>{{ art.text }}</p>
                </div>
                <div class="card_footer light-color">
                <a></a>
                <a class="danger-color button-delete" @click="delComment(art.id)">Удалить</a>
                </div>
            </div>
        </div>
    </section>
</template>

<script>


    import axios from 'axios'
    export default {
        name: "topic",
        data() {
            return {
                comments: [],
                info: {},
                loading: true,
                errored: false
            };
        },
        filters: {
            currencydecimal(value) {
                return value.toFixed(2);
            }
        },
        methods: {
             delComment(deleted_id) {
                axios
                    .delete('http://5db050f78087400014d37dc5.mockapi.io/api/users/1/events/' + this.info['id'] + '/comments/' + deleted_id)
                    .then(response => {
                        for (let index in this.comments) {
                            if (parseInt(this.comments[index].id) === parseInt(deleted_id)) {
                                this.comments.splice(index, 1)
                            }
                        }
                    })
            },
        },

        mounted() {
            // console.log(this.$route.params.id)
            axios
                .get('http://5db050f78087400014d37dc5.mockapi.io/api/users/1/events/'+this.$route.params.id)
                .then(response => {
                    this.info = response.data;
                    let dateObj = new Date(this.info['dete']);
                    let year = dateObj.getFullYear().toString();
                    let month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
                    let day = dateObj.getDate().toString().padStart(2, '0');
                    let dete = day + '.' + month + '.' + year;
                    this.info['date_read'] = dete;
                });

            axios
                .get('http://5db050f78087400014d37dc5.mockapi.io/api/users/1/events/'+this.$route.params.id+'/comments')
                .then(response => {
                    this.comments = response.data;
                    for (let index in this.comments) {
                        let predete = this.comments[index]['date'];
                        let dateObj = new Date(predete);
                        let year = dateObj.getFullYear().toString();
                        let month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
                        let day = dateObj.getDate().toString().padStart(2, '0');
                        let dete = day + '.' + month + '.' + year;
                        this.comments[index]['date'] = dete;
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
        }
    }
</script>

<style scoped>

</style>