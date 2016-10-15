import json

# General dirty list processor
def libs_list_insert(list_string, element):
    l = json.loads(list_string)
    if element in l:
        return None
    l.append(element)
    ret = json.dumps(l)
    return ret
def libs_list_delete(list_string, element):
    l = json.loads(list_string)
    if not element in l:
        return None
    l.remove(element)
    ret = json.dumps(l)
    return ret
def libs_list_query(list_string):
    return json.loads(list_string)
##############################

# Generai dirty dictionary processor
def libs_dict_insert(dict_string, key, value):
    l = json.loads(dict_string)
    l[str(key)] = value
    ret = json.dumps(l)
    return ret
def libs_dict_query(dict_string, key):
    l = json.loads(dict_string)
    return l[str(key)]
def libs_dict_query_all(dict_string):
    l = json.loads(dict_string)
    return l
####################################