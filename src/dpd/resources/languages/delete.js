if (this.default)
    error('name', "is default and cannot be deleted");

emit('languageDeleted', this);