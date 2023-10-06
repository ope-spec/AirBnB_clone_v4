#!/usr/bin/python3
"""
Contains class BaseModel
"""

from datetime import datetime
import models
from os import getenv
import sqlalchemy
from sqlalchemy import Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
import uuid
import inspect

time_format = "%Y-%m-%dT%H:%M:%S.%f"

if models.storage_t == "db":
    Base = declarative_base()
else:
    Base = object


class BaseModel:
    """The BaseModel class from which future classes will be derived"""
    if models.storage_t == "db":
        id = Column(String(60), primary_key=True)
        created_at = Column(DateTime, default=datetime.utcnow)
        updated_at = Column(DateTime, default=datetime.utcnow)

    def __init__(self, *args, **kwargs):
        """Initialization of the base model"""
        if kwargs:
            for key, value in kwargs.items():
                if key != "__class__":
                    setattr(self, key, value)
            if kwargs.get("created_at", None) and type(self.created_at) is str:
                self.created_at = datetime.strptime(kwargs["created_at"], time)
            else:
                self.created_at = datetime.utcnow()
            if kwargs.get("updated_at", None) and type(self.updated_at) is str:
                self.updated_at = datetime.strptime(kwargs["updated_at"], time)
            else:
                self.updated_at = datetime.utcnow()
            if kwargs.get("id", None) is None:
                self.id = str(uuid.uuid4())
        else:
            self.id = str(uuid.uuid4())
            self.created_at = datetime.utcnow()
            self.updated_at = self.created_at

    def __str__(self):
        """String representation of the BaseModel class"""
        return "[{:s}] ({:s}) {}".format(self.__class__.__name__, self.id,
                                         self.__dict__)

    def save(self):
        """updates the attribute 'updated_at' with the current datetime"""
        self.updated_at = datetime.utcnow()
        models.storage.new(self)
        models.storage.save()

    def to_dict(self):
        """
        Returns a dictionary representation of the instance.
        """
        new_dict = {
            key: value
            for key, value in self.__dict__.items()
            if key != "_sa_instance_state"
        }
        if hasattr(self, "created_at"):
            new_dict["created_at"] = self.created_at.strftime(time_format)
        if hasattr(self, "updated_at"):
            new_dict["updated_at"] = self.updated_at.strftime(time_format)

        new_dict["__class__"] = self.__class__.__name__
        call_funct = inspect.currentframe().f_back.f_code.co_name
        is_fs_class = getattr(self, '__class__.__name__', '') == 'FileStorage'
        is_fs_writing = call_funct == 'save' and is_fs_class
        if 'password' in new_dict and not is_fs_writing:
            del new_dict['password']
        return new_dict

    def delete(self):
        """Deletes the current instance from the storage"""
        models.storage.delete(self)
