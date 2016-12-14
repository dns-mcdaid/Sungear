import json
import sys
import os
from optparse import OptionParser

class Item(object):
    def __init__(self, id, description, species):
        self.id = id
        self.description = description
        self.species = species

    def print_string(self):
        # For Debugging
        print "{} - {} - {}".format(self.id, self.description, self.species)

class Category(object):
    def __init__(self, species):
        self.id = None
        self.description = None
        self.z_score = 0.0
        self.items = []
        self.parents = []
        self.children = []
        self.species = species

    def print_string(self):
        print self.id + " - " + self.description + " - " + str(self.z_score) + " - " + str(len(self.items)) + " - " + str(len(self.parents)) + " - " + str(len(self.children)) + " - " + self.species

class Experiment(object):
    def __init__(self, species, name):
        self.species = species
        self.name = name
        self.data ={}

QUIT = "quit"
ITEMS = []
CATEGORIES = {}

def main():
    uploading_species = display_welcome()
    species = ""
    if uploading_species:
        lib_files = get_new_library_files()
        if lib_files["failure"]:
            sys.exit(0)
        species = lib_files['species']
        create_categories(lib_files)

        categories_arr = map(lambda category_name: json.dumps(CATEGORIES[category_name].__dict__, indent=4, separators=(',', ': ')), CATEGORIES)
        items_arr = map(lambda item: json.dumps(item.__dict__, indent=4, separators=(',', ': ')), ITEMS)
        items_file = SPECIES + "-items.json"
        categories_file = SPECIES + "-categories.json"

        print "Writing items..."
        write_to_file(items_arr, items_file, True)
        print "Complete.\nWriting categories..."
        write_to_file(categories_arr, categories_file, True)
        print "Complete."
    uploading_experiment = ask_for_exp()
    if uploading_experiment:
        filename = get_experiment_file()
        experiment = set_experiment(filename, species)
        jsonified = json.dumps(experiment.__dict__, indent=4, separators=(',', ': '))
        print "Writing experiment..."
        write_to_file(jsonified, experiment.name + ".json", False)
        print "Complete."
    print "Thanks for using the Sungear data uploader script!"

def set_experiment(filename, species):
    parsed_w_dir = filename.split('.')
    split_dirs = parsed_w_dir[len(parsed_w_dir)-2].split('/')
    title = split_dirs[len(split_dirs)-1]
    if len(species) < 1:
        species = raw_input("What species does this experiment set belong to? ")
    this_experiment = Experiment(species, title)
    with open(filename, 'r') as infile:
        lines = infile.read().split('\n')
        set_names = []
        header = lines[0].split('|')
        for i in range(0, len(header)-1):
            label = header[i]
            data_set = label.strip()
            set_names.append(data_set)
            this_experiment.data[data_set] = []
        for i in range(1, len(lines)):
            values = lines[i].split('|')
            gene = values[len(values)-1].strip()
            for j in range(0, len(values)-1):
                this_value = values[j].strip()
                if this_value == "1":
                    this_experiment.data[set_names[j]].append(gene)
        infile.close()
        return this_experiment


def create_categories(file_map):
    species = file_map['species']
    categories = {}
    with open(file_map['geneU'], 'r') as geneU, open(file_map['listU'], 'r') as listU, open(file_map['assocU'], 'r') as assocU, open(file_map['hierU'], 'r') as hierU:
        genes = geneU.read().split('\n')
        category_names = listU.read().split('\n')
        hierarchies = hierU.read().split('\n')
        associations = assocU.read().split('\n')

        for gene in genes:
            if len(gene) < 1 or gene[0] == "{":
                continue
            else:
                parsed = gene.split('|')
                name = parsed[0].strip()
                desc = parsed[1].strip()
                ITEMS.append(Item(name, desc, species))

        for name in category_names:
            if len(name) < 1 or name[0] == "{":
                continue
            else:
                parsed = name.split('|')
                name = parsed[0].strip()
                desc = parsed[1].strip()
                to_cat = Category(species)
                to_cat.id = name
                to_cat.description = desc
                CATEGORIES[name] = to_cat

        for hier in hierarchies:
            if len(hier) < 1 or hier[0] == "{":
                continue
            else:
                parsed = hier.split('|')
                name = parsed[0].strip()
                b_child = parsed[1].strip()
                children = b_child.split(' ')
                if name not in CATEGORIES:
                    to_cat = Category(species)
                    to_cat.id = name
                    CATEGORIES[name] = to_cat
                this_category = CATEGORIES[name]
                for child in children:
                    this_category.children.append(child)
                    if child not in CATEGORIES:
                        to_cat = Category(species)
                        to_cat.id = child
                        CATEGORIES[child] = to_cat
                    CATEGORIES[child].parents.append(name)

        for assoc in associations:
            if len(assoc) < 1 or assoc[0] == "{":
                continue
            else:
                parsed = assoc.split('|')
                name = parsed[0].strip()
                z_score = parsed[1].strip()
                b_child = parsed[2].strip()
                if name not in CATEGORIES:
                    to_cat = Category(species)
                    to_cat.id = name
                    CATEGORIES[name] = to_cat
                CATEGORIES[name].z_score = z_score
                if len(b_child) > 0:
                    children = b_child.split(' ')
                    for child in children:
                        CATEGORIES[name].items.append(child)
        geneU.close()
        listU.close()
        assocU.close()
        hierU.close()

def write_to_file(json_data, filename, isArray):
    if isArray:
        with open(filename, 'w') as out_file:
            out_file.write('[\n')
            for i in range(0, len(json_data)):
                obj = json_data[i]
                if i == len(json_data) - 1:
                    out_file.write(obj)
                else:
                    out_file.write(obj + ",\n")
            out_file.write('\n]')
            out_file.close()
    else:
        with open(filename, 'w') as out_file:
            out_file.write(json_data)
            out_file.close()

def get_new_library_files():
    files = {"failure": False}
    print """\nLet's create some new species files. (write "quit" at any time to exit this section of the application)"""
    print "These are the following files we need:"
    print "\tgeneU:\t\tThe file of all items in this species."
    print "\tlistU:\t\tThe file of all categories with descriptions."
    print "\tassocU:\t\tThe file of all items belonging to these categories."
    print "\thierU:\t\tThe file of all categories belonging to other categories."
    print "Okay, now let's get started."
    species_name = raw_input("\nEnter the NAME of the new species: ")
    files['species'] = species_name
    print """\nI'll need you to specify the files we'll be using for the new species.\n"""
    file_titles = [ 'geneU', 'listU', 'assocU', 'hierU' ]
    i = 0
    while i < len(file_titles):
        title = file_titles[i]
        file_name = raw_input("Enter the name of the {} file: ".format(title))
        if file_name == QUIT:
            return {"failure": True}
        else:
            if os.path.isfile('./{}'.format(file_name)):
                files[title] = './{}'.format(file_name)
                i += 1
            else:
                print "\nERROR: This is not a valid file. Try again."
    return files

def get_experiment_file():
    file_name = raw_input("""Enter your experiment file name (or write "quit" to terminate the application): """)
    if file_name.lower() == "quit":
        sys.exit(0)
    elif os.path.isfile('./{}'.format(file_name)):
        return './{}'.format(file_name)
    else:
        print "ERROR: That is not a valid file. Please try again."
        return get_experiment_file()

def display_welcome():
    print "\nWelcome to Sungear's data converter. I'm going to ask you for a list of files."
    response = raw_input("Are you planning on importing an entire new species today (with both items and categories)? ")
    return "y" in response

def ask_for_exp():
    response = raw_input("Okay, are you looking to create a new experiment? ")
    return "y" in response

main()
