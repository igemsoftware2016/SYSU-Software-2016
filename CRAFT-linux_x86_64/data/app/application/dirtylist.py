import json

# General dirty list processor

# Usage: Insert an element to a json-dumped list
# Input:
#   list_string: A json-dumped list
#   element: Element to be inserted
# Output: A inserted json-dumped list, or None when insertion fail
def libs_list_insert(list_string, element):
    l = json.loads(list_string)
    if element in l:
        return None
    l.append(element)
    ret = json.dumps(l)
    return ret

# Usage: Delete an element from a json-dumped list
# Input:
#   list_string: A json-dumped list
#   element: Element to be deleted
# Output: A deleted json-dumped list, or None when insertion fail
def libs_list_delete(list_string, element):
    l = json.loads(list_string)
    if not element in l:
        return None
    l.remove(element)
    ret = json.dumps(l)
    return ret

# Usage: Transform a json-dumped list to a real list
# Input:
#   list_strting: A json-dumped list
# Output: A list from the json-dumped list
def libs_list_query(list_string):
    return json.loads(list_string)


# Generai dirty dictionary processor

# Usage: Insert a value with a key to a json-dumped dict
# Input:
#   dict_string: A json-dumped dict
#   key: where the value is inserted
#   value: the value to be inserted
# Output: Inserted json-dumped dict
def libs_dict_insert(dict_string, key, value):
    l = json.loads(dict_string)
    l[str(key)] = value
    ret = json.dumps(l)
    return ret

# Usage: Query the value at the key
# Input:
#   dict_string: A json-dumped dict
#   key: where the value is
# Output: the queried value
def libs_dict_query(dict_string, key):
    l = json.loads(dict_string)
    return l.get(str(key))

# Usage: Query the whole dict
# Input:
#   dict_string: A json-dumped dict
# Output: The whole dict loaded from dict_string
def libs_dict_query_all(dict_string):
    l = json.loads(dict_string)
    return l
