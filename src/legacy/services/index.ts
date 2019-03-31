import { CharacterService } from './character.service';
import * as angular from 'angular';

const app = angular.module('dnsim');

app.service('character', ['dntData', 'itemColumnsToLoad', 'jobs', 'hCodeValues', 'statHelper', CharacterService]);
