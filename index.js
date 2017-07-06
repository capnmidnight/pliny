/*
 * Copyright (C) 2016 Sean T. McBeth
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */



////////////////////////////////////////////////////////////////////////////
// Pliny's author is not smart enough to figure out how to make it        //
// possible to use it to document itself, so here's a bunch of comments.  //
////////////////////////////////////////////////////////////////////////////



// Pliny is a documentation construction system. You create live documentation
// objects on code assets with pliny, then you read back those documentation objects
// with pliny.
//
// Pliny is also capable of generating HTML output for your documentation.
//
// Pliny is named after Gaius Plinius Secundus (https://en.wikipedia.org/wiki/Pliny_the_Elder),
// a scholar and hero, who died trying to save people from the eruption of Mount
// Vesuvius during the destruction of Pompeii. Also, his nephew Gaius Plinius Caecilius Secundus
// (https://en.wikipedia.org/wiki/Pliny_the_Younger), through whom we know his uncle.

var p = require("./pliny"),
  e = require("./pliny-extractor"),
  f = require("./pliny-formatter");

module.exports = Object.assign({}, f, e, p);
