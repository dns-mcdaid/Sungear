# Sungear

Sungear enables rapid, visually interactive exploration of large sets of genomic data. It allows browsing of gene sets by experiment membership, gene annotation, and ontological term. The purpose of Sungear is to make otherwise complicated queries quick and visually intuitive.

## Authors

* [Radhika Mattoo](https://github.com/radhikamattoo)
* [Dennis McDaid](https://github.com/RajahBimmy)

## Guide and FAQ
If you have questions about how to use Sungear, or if it isn't loading properly, check out the sungear [documentation](docs/).

## Quick Links

To start Sungear with one of our pre-loaded data files, click the corresponding link below. After launching Sungear, you can switch to a different pre-loaded data set using the Sungear menu option File | Load...

* __Microarray data__: This dataset was generated from published microarray studies that identified Arabidopsis genes regulated by transient treatments with the nutrients nitrogen (N) and or carbon (C) (Price, J., et al. (2004) Plant Cell 16, 2128-2150; Scheible, W.-R., et al. (2004) Plant Physiol. 136, 2483-2499; Wang, R., et al. (2004) Plant Physiol 136, 2512-2522. ). In this example, six lists of genes containing N- or CN-regulated genes (I= induced; D= depressed) provide the anchors for Sungear. These experiments conducted by three different research groups all share the feature of transiently treating Arabidopsis seedlings with nitrogen or nitrogen plus carbon nutrients, and assaying gene responses using the ATH1 Affymetrix whole genome chips.

* __Comparative Genomics__: This dataset was generated from a BLASTP comparison of all Arabidopsis thaliana protein sequences to the protein sequences in C. elegans (worm), D. melanogaster (fly), H. sapiens (human), M. musculus (mouse), R. norvegicus (rat), S. cerevisiae (yeast), S. pombe (fission yeast), and a collection of Cyanobacterial, Archaea and bacterial genomes, as described previously (Gutiérrez et al. 2004). In this analysis, the Arabidopsis proteins are the "background" used for annotation (Gene names and GO terms).

* __Developmental Time Course__: Microarray Experiments from different developmental time points of Arabidopsis thaliana ( Shmid et al 2005 ) were grouped into different developmental stages (Seedling, Young Plants, Mature Plants, Flowering Plants, and Seed Development). Genes that were determined to be differentially expressed (using inhouse statistical analysis) were plotted using Sungear.

## Upload Your Own Data

To view your own data in sungear, HANG ON, WE'RE GETTING TO THAT SOON.

__Species__ refers to the source of gene annotations for the genes in your experiment. Pick the appropriate species from the pull-down list. If you don't see the species you need, contact us.

__Experiment File__ is the file containing your data. Click the "Browse" button to choose a data file from your computer.

__File format__ is the format of your data file. Examples of the acceptable data file formats are provided below.

## Acceptable data formats

* FASTA-like format:
```
>List1
At1g01050
At1g01450
At1g01460
At1g01510
At1g01560
At1g01740
At1g02970
At1g03030
At1g03450
At1g03590
At1g03740
At1g03920
>List2
At1g03740
At1g03920
At1g77760
At5g53460
At1g05250
At3g49960
At5g17820
```

* Sungear data format:
```
List1 | List2 | gene
1     | 0     | At1g01050
1     | 0     | At1g01450
1     | 0     | At1g01460
1     | 0     | At1g01510
1     | 0     | At1g01560
1     | 0     | At1g01740
1     | 0     | At1g02970
1     | 0     | At1g03030
1     | 0     | At1g03450
1     | 0     | At1g03590
0     | 1     | At1g77760
0     | 1     | At5g53460
0     | 1     | At1g05250
0     | 1     | At3g49960
0     | 1     | At5g17820
1     | 1     | At1g03740
1     | 1     | At1g03920
```

## Dependencies

In order to run on a modern web browser, Sungear requires the following dependencies:

* [Node.js](https://nodejs.org/en/): Runtime environment for entire program.
* [Express](https://expressjs.com/): The jelly to Node's peanut butter. Holds together and keeps track of our dependencies.
* [p5](http://p5js.org/): Data visualizer for Sungear GUI and GeneLights description.
* [Browserify](http://browserify.org/): A magical gift from the Gods which brings all of the fun Node has to offer to the client side.
* [javascript.util](https://www.npmjs.com/package/javascript.util): Tree Set resource.
* [collections.js](http://www.collectionsjs.com/): SortedSet resource.
* [Jade](http://jade-lang.com/): Template engine used for Node apps.
* [jQuery](https://jquery.com/): Necessary for Bootstrap and manipulating Javascript Objects.
* [Bootstrap](http://getbootstrap.com/): Grid System responsible for our entire UI looking somewhat easy on the eyes.