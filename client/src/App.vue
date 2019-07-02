<template>
  <v-layout justify-center>
    <v-flex xs12>
      <v-toolbar dark>
        <v-toolbar-title class="headline">
          <v-icon dark>chat</v-icon>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn to='/nrz' flat>NRZ</v-btn>
          <v-btn to='/rz' flat>RZ</v-btn>
        </v-toolbar-items>
        <v-spacer></v-spacer>
      </v-toolbar>

      <router-view/>
    </v-flex>
  </v-layout>
</template>
