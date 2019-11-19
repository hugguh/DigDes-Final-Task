<template>
    <section>
        <div class="center" v-if="errored">
            <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
        </div>
        <div class="center" v-else>
            <header>
                <nav class="navigation">
                    <div class="first_nav_col">
                        <button class="nav_item" @click="showPastTopics">Прошедшие</button>
                        <button class="nav_item" @click="showPresentTopics">Текущие</button>
                        <button class="nav_item" @click="showFutureTopics">Ближайшие</button>
                    </div>
                    <div class="second_nav_col">
                        <div class="nav_input"><input class="input" @change="searchTopics" v-model="search" placeholder="Search..."></div>
                    </div>
                </nav>

            </header>
            <div class="button-add-sort">
                <a class="button-left" v-bind:href="'#/create'">+ Добавить событие</a>
                <button class="button-right" @click="sortTopics">Сортировать по: Дате</button>
            </div>
            <div v-if="loading">Loading...</div>
            <div v-else>
                <div v-for="topic in displayedPosts" class="card">
                    <div class="card_local">
                        <div class="card_header">
                            <a class="card_head neutral-primary" v-bind:href="'#/topic/'+topic.id">{{topic.title}} </a>
                            <a class="danger-color button-delete" @click="delTopic(topic.id)">Удалить</a>
                        </div>
                        <div class="card_body">
                            <a v-bind:href="'#/topic/'+topic.id" class="neutral-primary">{{ topic.description }}</a>
                        </div>
                        <div class="card_footer">
                            <a v-bind:href="'#/topic/'+topic.id" class="light-color">Дата публикации: {{topic.dete_read}}</a>
                            <a v-bind:href="'#/topic/'+topic.id" class="light-color">Комментарии:
                                {{topic.comments.length}}</a>
                        </div>
                    </div>
                </div>
                <div class="center">
                    <button type="button" class="button-page button-arrow" v-if="page != 1" @click="page--">
                        Сюда
                    </button>
                    <button type="button" class="button-page button-number"
                            v-for="pageNumber in pages.slice(Math.max(0,page-6), page+5)" @click="page = pageNumber">
                        {{pageNumber}}
                    </button>
                    <button type="button" @click="page++" v-if="page < pages.length" class="button-page button-arrow">
                        Туда
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import axios from 'axios'

    export default {
        data() {
            return {
                loading: true,
                errored: false,
                posts: [],
                baseUrl: 'http://5db050f78087400014d37dc5.mockapi.io/api/users/1/',
                page: 1,
                perPage: 5,
                pages: [],
                date: '',
                sortOrder: 'asc',
                search: '',
                period: 'all',
            }
        },
         created() {
            this.getPosts();
        },
        methods: {
            getPosts() {
                this.loading = true;
                axios
                    .get(this.baseUrl + 'events')
                    .then(response => {
                        this.posts = response.data;
                        this.errored = false;
                    })
                    .catch(error => {
                        console.log(error)
                        this.errored = true
                    })
                    .finally(() => (this.loading = false))
            },
            paginate(posts) {
                let page = this.page;
                let perPage = this.perPage;
                let from = (page * perPage) - perPage;
                let to = (page * perPage);
                return posts.slice(from, to);
            },
            delTopic(deleted_id) {
                axios
                    .delete(this.baseUrl + 'events/' + deleted_id)
                    .then(response => {
                        for (let topic_index in this.posts) {
                            if (parseInt(this.posts[topic_index].id) === parseInt(deleted_id)) {
                                this.posts.splice(topic_index, 1)
                            }
                        }
                    })
            },
            sortTopics() {
                this.loading = true;
                if (this.sortOrder === 'asc') {
                    this.sortOrder = 'desc'
                }
                else {
                    this.sortOrder = 'asc'
                }
                axios
                    .get(this.baseUrl + 'events?sortBy=dete&order=' + this.sortOrder)
                    .then(response => {
                        this.posts = response.data;
                        this.errored = false;
                        })
                        .catch(error => {
                            this.errored = true
                        })
                        .finally(() => (this.loading = false))
            },
            searchTopics() {
                this.loading = true;
                axios
                    .get(this.baseUrl + 'events?search=' + this.search)
                    .then(response => {
                        this.posts = response.data;
                        this.errored = false;
                        })
                        .catch(error => {
                            this.errored = true
                        })
                        .finally(() => (this.loading = false))
            },
            showPresentTopics() {
                this.period = 'now';
                this.page = 1;
            },
            showPastTopics() {
                this.period = 'prev';
                this.page = 1;
            },
            showFutureTopics() {
                this.period = 'next';
                this.page = 1;
            }
        },
        watch: {
        },
        computed: {
            displayedPosts() {
                let posts = this.posts;
                let preposts = [];
                let now = parseInt(new Date().getTime() / 86400000);
                if (this.period === 'all') {
                    for (let index in posts) {
                        preposts.push(posts[index])
                    }
                }
                else if (this.period === 'now') {
                    for (let index in posts) {
                        let predete = posts[index]['dete'];
                        let date = parseInt(new Date(predete).getTime() / 86400000);
                        if (date === now) {
                            preposts.push(posts[index])
                        }
                    }
                }
                else if (this.period === 'prev') {
                    for (let index in posts) {
                        let predete = posts[index]['dete'];
                        let date = parseInt(new Date(predete).getTime() / 86400000);
                        if (date < now) {
                            preposts.push(posts[index])
                        }
                    }
                }

                else {
                    for (let index in posts) {
                        let predete = posts[index]['dete'];
                        let date = parseInt(new Date(predete).getTime() / 86400000);
                        if (date > now) {
                            preposts.push(posts[index])
                        }
                    }
                }
                for (let index in preposts) {
                    let predete = preposts[index]['dete'];
                    let dateObj = new Date(predete);
                    let year = dateObj.getFullYear().toString();
                    let month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
                    let day = dateObj.getDate().toString().padStart(2, '0');
                    let dete = day + '.' + month + '.' + year;
                    preposts[index]['dete_read'] = dete;
                }

                this.pages = [];
                let numberOfPages = Math.ceil(preposts.length / this.perPage);
                for (let index = 1; index <= numberOfPages; index++) {
                    this.pages.push(index);
                }

                return this.paginate(preposts)
            },

        },
    }


</script>

<style lang="scss" scoped>

</style>
