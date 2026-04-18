<script setup>

import axios from "axios";
import { ref } from "vue";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

let showModal = ref(false);
let result = ref('');
let formError = ref('');
let loading = ref(false);

let username = ref('');
let password = ref('');
let users = ref([]);
let editingId = ref(null);
let originalUsername = ref('');
let originalPassword = ref('');

function showMessage(msg) {
    result.value = msg;
    setTimeout(() => result.value = '', 3000);
}

function resetForm() {
    username.value = '';
    password.value = '';
    editingId.value = null;
    formError.value = '';
}

function validate() {
    if (!username.value.trim() || !password.value.trim()) {
        formError.value = "All fields required";
        return false;
    }
    return true;
}

function addusers() {
    resetForm();
    showModal.value = true;
}

function updateUser(user) {
    editingId.value = user.id;
    username.value = user.username;
    password.value = user.password;
    originalUsername.value = user.username;
    originalPassword.value = user.password;
    formError.value = '';
    showModal.value = true;
}

async function saveusers() {
    if (!validate()) return;

    loading.value = true;
    formError.value = '';

    try {
        let res;

        if (editingId.value) {
            const updates = {};
            if (username.value !== originalUsername.value) updates.username = username.value;
            if (password.value !== originalPassword.value) updates.password = password.value;

            if (Object.keys(updates).length === 0) {
                formError.value = "No changes made";
                loading.value = false;
                return;
            }

            res = await axios.patch(`${API_URL}/updateuser/${editingId.value}`, updates);

            users.value = users.value.map(u =>
                u.id === editingId.value ? { ...u, ...updates } : u
            );

        } else {
            res = await axios.post(`${API_URL}/adduser`, {
                username: username.value,
                password: password.value,
            });

            await getusers();
        }

        showMessage(res.data.message);
        showModal.value = false;
        resetForm();

    } catch (err) {
        console.error(err);
        formError.value = "Operation failed";
    } finally {
        loading.value = false;
    }
}

async function getusers() {
    try {
        const res = await axios.get(`${API_URL}/getusers`);
        users.value = res.data;
        if (res.data.length === 0) {
            showMessage("No users found");
        }
    } catch (err) {
        console.error(err);
        showMessage("Fetch failed");
    }
}

function closeUsers() {
    users.value = [];
}

async function deleteUser(id) {
    if (!confirm("Delete this user?")) return;

    try {
        const res = await axios.delete(`${API_URL}/deleteuser/${id}`);
        users.value = users.value.filter(u => u.id !== id);
        showMessage(res.data.message || "Deleted");
    } catch (err) {
        console.error(err);
        showMessage("Delete failed");
    }
}

</script>

<template>

    <!-- Buttons -->
    <div class="flex p-4 justify-center gap-4 mb-4">
        <button class="bg-blue-600 px-4 py-3 rounded-2xl text-white hover:bg-blue-500" @click="addusers">
            Add User
        </button>

        <button class="bg-emerald-600 px-4 py-3 rounded-2xl text-white hover:bg-emerald-500" @click="getusers">
            Get Users
        </button>
    </div>

    <!-- Global message -->
    <p v-if="result" class="text-center text-red-500 font-semibold mb-4">
        {{ result }}
    </p>

    <!-- Users -->
    <div v-if="users.length" class="p-4 max-w-xl mx-auto bg-white rounded-xl shadow">

        <div class="flex justify-between mb-3">
            <h2 class="font-semibold">Users</h2>
            <button class="text-red-500" @click="closeUsers">Clear</button>
        </div>

        <div v-for="user in users" :key="user.id" class="flex justify-between items-center border-b py-2">

            <div>
                <p class="font-semibold">{{ user.username }}</p>
                <p class="text-sm text-gray-500">ID: {{ user.id }}</p>
            </div>

            <div class="flex gap-2">
                <button class="bg-yellow-500 text-white px-3 py-1 rounded" @click="updateUser(user)">
                    Edit
                </button>

                <button class="bg-red-500 text-white px-3 py-1 rounded" @click="deleteUser(user.id)">
                    Delete
                </button>
            </div>
        </div>

    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

        <div class="bg-white p-6 rounded-2xl w-[350px]">

            <h2 class="text-lg font-semibold mb-3">
                {{ editingId ? "Update User" : "Add User" }}
            </h2>

            <!-- error inside modal -->
            <p v-if="formError" class="text-red-500 text-sm mb-2">
                {{ formError }}
            </p>

            <input v-model="username" class="border w-full px-3 py-2 mb-3 rounded" placeholder="Username" />

            <input v-model="password" class="border w-full px-3 py-2 mb-3 rounded" placeholder="Password" />

            <div class="flex justify-end gap-2">

                <button class="px-3 py-2 bg-gray-300 rounded" @click="showModal = false">
                    Cancel
                </button>

                <button class="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50" :disabled="loading"
                    @click="saveusers">
                    {{ loading ? "Saving..." : "Save" }}
                </button>

            </div>

        </div>
    </div>

</template>